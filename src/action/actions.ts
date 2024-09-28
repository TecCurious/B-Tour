"use server";
// Helper functions for data operations

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// User registration
export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1d' })

  return {
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
    // token,
  };
}

// User login
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  console.log(user);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' })

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    // token,
  };
}

export async function getAllTeamMembers(teamId: string) {
  const teamMembers = await prisma.teamMember.findMany({
    where: {
      teamId: teamId,
    },
    select: {
      id: true,
      paidAmount: true,
      payableAmount: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return teamMembers;
}


// Search team members
async function searchTeamMembers(teamId: string, searchTerm: string) {
  return prisma.teamMember.findMany({
    where: {
      teamId,
      user: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
    },
    include: { user: true },
  });
}

// Get all expenses (with pagination)
async function getAllExpenses(page: number = 1, perPage: number = 10) {
  const skip = (page - 1) * perPage;
  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({
      skip,
      take: perPage,
      orderBy: { createdAt: "desc" },
      include: {
        creator: { include: { user: true } },
        team: true,
      },
    }),
    prisma.expense.count(),
  ]);

  return {
    expenses,
    pagination: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  };
}

// Create expense by team member
// async function createExpenseByTeamMember(title: string, amount: number, teamMemberId: string) {
//   const teamMember = await prisma.teamMember.findUnique({
//     where: { id: teamMemberId },
//     include: { team: { include: { members: true } } },
//   })

//   if (!teamMember) throw new Error('Team member not found')

//   const splitAmount = amount / teamMember.team.members.length

//   const expense = await prisma.expense.create({
//     data: {
//       title,
//       amount,
//       teamId: teamMember.teamId,
//       creatorId: teamMember.id,
//       splits: {
//         create: teamMember.team.members.map(member => ({
//           memberId: member.id,
//           amount: splitAmount,
//         })),
//       },
//     },
//   })

// Update paid and payable amounts for team members
//   await Promise.all(teamMember.team.members.map(member =>
//     prisma.teamMember.update({
//       where: { id: member.id },
//       data: {
//         paidAmount: member.id === teamMemberId ? { increment: amount } : { increment: 0 },
//         payableAmount: member.id !== teamMemberId ? { increment: splitAmount } : { increment: 0 },
//       },
//     })
//   ))

//   return expense
// }

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
  });

  if (!teamMember) throw new Error("Team member not found");

  return {
    ...teamMember,
    netBalance: teamMember.paidAmount - teamMember.payableAmount,
  };
}

// Updated function to update all team members' paid and payable amounts
// async function updateTeamMemberAmounts(
//   teamId: string,
//   updates: { memberId: string; paidAmount: number; payableAmount: number }[]
// ) {
//   const team = await prisma.team.findUnique({
//     where: { id: teamId },
//     include: { members: true },
//   });

//   if (!team) {
//     throw new Error("Team not found");
//   }

//   const updatePromises = updates.map(async (update) => {
//     const member = team.members.find((m) => m.id === update.memberId);
//     if (!member) {
//       throw new Error(
//         `Team member with id ${update.memberId} not found in the team`
//       );
//     }

//     return prisma.teamMember.update({
//       where: { id: update.memberId },
//       data: {
//         paidAmount: { increment: update.paidAmount },
//         payableAmount: { increment: update.payableAmount },
//       },
//       include: {
//         user: { select: { name: true, email: true } },
//         team: { select: { name: true } },
//       },
//     });
//   });

//   const updatedMembers = await Promise.all(updatePromises);

//   return updatedMembers.map((member) => ({
//     ...member,
//     netBalance: member.paidAmount - member.payableAmount,
//   }));
// }

// Updated function to create a team with user-provided ID and destination
export async function createTeam(
  creatorId: string,
  teamId: string,
  teamName: string,
  teamDestination: string | null = null
) {
  const creator = await prisma.user.findUnique({ where: { id: creatorId } });
  if (!creator) {
    throw new Error("User not found");
  }

  // Check if the team ID is already in use
  const existingTeam = await prisma.team.findUnique({ where: { id: teamId } });
  if (existingTeam) {
    throw new Error("Team ID is already in use");
  }

  try {
    const team = await prisma.team.create({
      data: {
        id: teamId,
        name: teamName,
        destination: teamDestination,
        creatorId: creator.id,
        members: {
          create: {
            userId: creator.id,
          },
        },
      },
      include: {
        creator: { select: { name: true, email: true } },
        members: { include: { user: { select: { name: true, email: true } } } },
      },
    });

    return {
      id: team.id,
      name: team.name,
      destination: team.destination,
      creator: team.creator,
      members: team.members.map((member) => ({
        id: member.id,
        user: member.user,
      })),
    };
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("Team ID is already in use");
    }
    throw error;
  }
}

export async function createdTeam(creatorId: string) {
  const teams = await prisma.team.findMany({
    where: {
      creatorId,
    },
    select: {
      id: true, // Select the team ID
      name: true, // Select the team name
      destination: true, // Select the team destination
      createdAt: true, // Select the creation date
    },
  });

  return teams;
}

// Function to get all teams (created or joined) for a user

export async function getAllTeamsForUser(userId: string) {
  const teams = await prisma.team.findMany({
    where: {
      OR: [{ creatorId: userId }, { members: { some: { userId: userId } } }],
    },
    include: {
      members: true,
    },
  });

  return teams;
}

// Function to get only joined teams for a user
export async function getJoinedTeamsForUser(userId: string) {
  const joinedTeams = await prisma.team.findMany({
    where: {
      members: { some: { userId: userId } },
      creatorId: { not: userId }, // Exclude teams created by the user
    },
    include: {
      members: true,
    },
  });

  return joinedTeams;
}

// Updated function to join a team using the team ID
export async function joinTeam(userId: string, teamId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { members: true },
  });
  if (!team) {
    throw new Error("Team not found");
  }

  // Check if the user is already a member of the team
  const existingMember = team.members.find(
    (member) => member.userId === userId
  );
  if (existingMember) {
    throw new Error("User is already a member of this team");
  }

  try {
    const teamMember = await prisma.teamMember.create({
      data: {
        userId: user.id,
        teamId: team.id,
      },
      include: {
        user: { select: { name: true, email: true } },
        team: { select: { name: true, destination: true } },
      },
    });

    return {
      id: teamMember.id,
      user: teamMember.user,
      team: teamMember.team,
    };
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("User is already a member of this team");
    }
    throw error;
  }
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.
export async function createExpenseAndUpdateBalances(
  creatorUserId: string,
  teamId: string,
  title: string,
  amount: number
) {
  return await prisma.$transaction(async (prisma) => {
    // Get all team members
    const teamMembers = await prisma.teamMember.findMany({
      where: { teamId: teamId },
      include: { user: true }, // Include user information
    });

    if (teamMembers.length === 0) {
      throw new Error("No team members found for this team");
    }

    // Find the creator's team member record
    const creatorMember = teamMembers.find(
      (member) => member.user.id === creatorUserId
    );
    if (!creatorMember) {
      throw new Error("Creator is not a member of this team");
    }

    // Calculate share amount for each member
    const shareAmount = amount / teamMembers.length;

    // Create the expense with shares
    const expense = await prisma.expense.create({
      data: {
        title,
        amount,
        teamId,
        creatorId: creatorMember.id, // Use the creator's team member ID
        shares: {
          create: teamMembers.map((member) => ({
            memberId: member.id,
            amount: shareAmount,
          })),
        },
      },
      include: {
        shares: true,
      },
    });

    // Update balances for all team members
    for (const member of teamMembers) {
      if (member.id === creatorMember.id) {
        // Update creator's paidAmount and payableAmount
        await prisma.teamMember.update({
          where: { id: member.id },
          data: {
            paidAmount: { increment: amount },
            // payableAmount: { increment: shareAmount },
          },
        });
      } else {
        // Update other members' payableAmount
        await prisma.teamMember.update({
          where: { id: member.id },
          data: {
            payableAmount: { increment: shareAmount },
          },
        });
      }
    }

    return expense;
  });
}
// Function to get team member balances
async function getTeamMemberBalances(teamId: string) {
  const teamMembers = await prisma.teamMember.findMany({
    where: { teamId },
    select: {
      id: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      paidAmount: true,
      payableAmount: true,
    },
  });

  return teamMembers.map((member) => ({
    ...member,
    balance: member.paidAmount - member.payableAmount,
  }));
}

export async function getTeamExpensesWithDetails(teamId: string) {
  try {
    const expenses = await prisma.expense.findMany({
      where: {
        teamId: teamId,
      },
      select: {
        id: true,
        title: true,
        amount: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return expenses;
  } catch (error) {
    console.error("Error fetching team expenses:", error);
    throw error;
  }
}
