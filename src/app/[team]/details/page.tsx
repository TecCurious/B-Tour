"use client"
import Findpayments from "@/components/FindPayments/ExpanceHistory";
import Seeteammembers from "@/components/Teamdetails/seeteammembers";
import Createpayment from "@/components/createpayment/CreateExpence";
import Link from "next/link";
import React, { useState } from "react";

const Teamdetail = (params: any) => {
    const [activePage, setActivePage] = useState('team-members');

    const renderComponent = () => {
        switch(activePage) {
            case 'team-members':
                return <Seeteammembers teamid={params} />;
            case 'create-payment':
                return <Createpayment teamid={params} />;
            case 'find-payments':
                return <Findpayments teamid={params} />;
            default:
                return <Seeteammembers teamid={params} />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left-side Dashboard */}
            <div className="w-64 bg-white shadow-md">
                <Link href="/dashboard">
                    <div className="p-4 hover:bg-gray-100 cursor-pointer">Back</div>
                </Link>
                <nav className="mt-6">
                    <button 
                        onClick={() => setActivePage('team-members')}
                        className={`w-full text-left p-4 hover:bg-gray-100 ${activePage === 'team-members' ? 'bg-gray-200' : ''}`}
                    >
                        Team Members
                    </button>
                    <button 
                        onClick={() => setActivePage('create-payment')}
                        className={`w-full text-left p-4 hover:bg-gray-100 ${activePage === 'create-payment' ? 'bg-gray-200' : ''}`}
                    >
                        Create Payment
                    </button>
                    <button 
                        onClick={() => setActivePage('find-payments')}
                        className={`w-full text-left p-4 hover:bg-gray-100 ${activePage === 'find-payments' ? 'bg-gray-200' : ''}`}
                    >
                        Find Payments
                    </button>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6">
                <h1 className="text-3xl font-bold text-center mb-6">Team Details</h1>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {renderComponent()}
                </div>
            </div>
        </div>
    );
}

export default Teamdetail;