"use server"
// Helper functions for data operations

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()




// User registration
async function registerUser(name: string, email: string, password: string) {
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  // const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1d' })

  return {
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
    // token,
  }
}

// User login
async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new Error('Invalid email or password')
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new Error('Invalid email or password')
  }

  // const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' })

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  }
}


// Create a new expense and split it among team members
async function createExpense(title: string, amount: number, teamId: string, creatorId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { members: true },
  })

  if (!team) throw new Error('Team not found')

  const splitAmount = amount / team.members.length

  const expense = await prisma.expense.create({
    data: {
      title,
      amount,
      teamId,
      creatorId,
      splits: {
        create: team.members.map(member => ({
          memberId: member.id,
          amount: splitAmount,
        })),
      },
    },
  })

  // Update paid and payable amounts for team members
  await Promise.all(team.members.map(member =>
    prisma.teamMember.update({
      where: { id: member.id },
      data: {
        paidAmount: member.id === creatorId ? { increment: amount } : { increment: 0 },
        payableAmount: member.id !== creatorId ? { increment: splitAmount } : { increment: 0 },
      },
    })
  ))

  return expense
}

// Get all expenses for a team with creator and split details
async function getTeamExpenses(teamId: string) {
  return prisma.expense.findMany({
    where: { teamId },
    include: {
      creator: { include: { user: true } },
      splits: { include: { member: { include: { user: true } } } },
    },
  })
}

// Get balance sheet for a team member
async function getMemberBalance(teamMemberId: string) {
  const member = await prisma.teamMember.findUnique({
    where: { id: teamMemberId },
    include: {
      user: true,
      team: true,
      createdExpenses: true,
      involvedExpenses: { include: { expense: true } },
    },
  })

  if (!member) throw new Error('Team member not found')

  return {
    user: member.user,
    team: member.team,
    paidAmount: member.paidAmount,
    payableAmount: member.payableAmount,
    netBalance: member.paidAmount - member.payableAmount,
  }
}

// New functions

// Search team members
async function searchTeamMembers(teamId: string, searchTerm: string) {
  return prisma.teamMember.findMany({
    where: {
      teamId,
      user: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
    },
    include: { user: true },
  })
}

// Get all expenses (with pagination)
async function getAllExpenses(page: number = 1, perPage: number = 10) {
  const skip = (page - 1) * perPage
  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({
      skip,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: {
        creator: { include: { user: true } },
        team: true,
      },
    }),
    prisma.expense.count(),
  ])

  return {
    expenses,
    pagination: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  }
}

// Create expense by team member
async function createExpenseByTeamMember(title: string, amount: number, teamMemberId: string) {
  const teamMember = await prisma.teamMember.findUnique({
    where: { id: teamMemberId },
    include: { team: { include: { members: true } } },
  })

  if (!teamMember) throw new Error('Team member not found')

  const splitAmount = amount / teamMember.team.members.length

  const expense = await prisma.expense.create({
    data: {
      title,
      amount,
      teamId: teamMember.teamId,
      creatorId: teamMember.id,
      splits: {
        create: teamMember.team.members.map(member => ({
          memberId: member.id,
          amount: splitAmount,
        })),
      },
    },
  })

  // Update paid and payable amounts for team members
  await Promise.all(teamMember.team.members.map(member =>
    prisma.teamMember.update({
      where: { id: member.id },
      data: {
        paidAmount: member.id === teamMemberId ? { increment: amount } : { increment: 0 },
        payableAmount: member.id !== teamMemberId ? { increment: splitAmount } : { increment: 0 },
      },
    })
  ))

  return expense
}

// Get team member's paid and payable amounts
async function getTeamMemberAmounts(teamMemberId: string) {
  const teamMember = await prisma.teamMember.findUnique({
    where: { id: teamMemberId },
    select: {
      id: true,
      paidAmount: true,
      payableAmount: true,
      user: { select: { name: true, email: true } },
      team: { select: { name: true } },
    },
  })

  if (!teamMember) throw new Error('Team member not found')

  return {
    ...teamMember,
    netBalance: teamMember.paidAmount - teamMember.payableAmount,
  }
}




// Updated function to update all team members' paid and payable amounts
async function updateTeamMemberAmounts(teamId: string, updates: { memberId: string, paidAmount: number, payableAmount: number }[]) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { members: true },
  })

  if (!team) {
    throw new Error('Team not found')
  }

  const updatePromises = updates.map(async (update) => {
    const member = team.members.find(m => m.id === update.memberId)
    if (!member) {
      throw new Error(`Team member with id ${update.memberId} not found in the team`)
    }

    return prisma.teamMember.update({
      where: { id: update.memberId },
      data: {
        paidAmount: { increment: update.paidAmount },
        payableAmount: { increment: update.payableAmount },
      },
      include: {
        user: { select: { name: true, email: true } },
        team: { select: { name: true } },
      },
    })
  })

  const updatedMembers = await Promise.all(updatePromises)

  return updatedMembers.map(member => ({
    ...member,
    netBalance: member.paidAmount - member.payableAmount,
  }))
}
