import type { ReactNode } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Building2, CreditCard, ArrowLeftRight, FileText, Menu, X } from "lucide-react";
import { useState } from 'react';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        { name: "Add Account", href: "/add-account", icon: CreditCard },
        { name: "Account Details", href: "/account-details", icon: FileText },
        { name: "Transfer Funds", href: "/transfer", icon: ArrowLeftRight },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen w-screen">
            <header className="border-b border-border">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">FinanceFlow</h1>
                                <p className="text-xs hidden sm:block">Internal Transfer System</p>
                            </div>
                        </div>

                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex w-full">
                <nav className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] flex-shrink-0">
                    <div className="py-8 px-4">
                        <div className="space-y-2">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.href;

                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`flex items-center space-x-4 px-4 py-3 hover:bg-gray-50 rounded-lg ${isActive ? "bg-gray-100 rounded-lg" : ""}`}
                                    >
                                        <Icon className={`h-5 w-5 ${isActive ? "" : "text-gray-500"}`} />
                                        <span className={`text-sm font-medium ${isActive ? "" : "text-gray-700"}`}>
                                            {item.name}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </nav>

                {isMobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={closeMobileMenu}>
                        <nav className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50">
                            <div className="py-4 px-4">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg">
                                            <Building2 className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h1 className="text-xl font-bold">FinanceFlow</h1>
                                            <p className="text-xs hidden sm:block">Internal Transfer System</p>
                                        </div>
                                    </div>
                                    {navigation.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = location.pathname === item.href;

                                        return (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                onClick={closeMobileMenu}
                                                className={`flex items-center space-x-4 px-4 py-3 hover:bg-gray-50 rounded-lg ${isActive ? "bg-gray-100 rounded-lg" : ""}`}
                                            >
                                                <Icon className={`h-5 w-5 ${isActive ? "" : "text-gray-500"}`} />
                                                <span className={`text-sm font-medium ${isActive ? "" : "text-gray-700"}`}>
                                                    {item.name}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </nav>
                    </div>
                )}

                {/* <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)]"> */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;