import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Budget from './pages/Budget';
import Family from './pages/Family';
import Recurring from './pages/Recurring';
import Savings from './pages/Savings';
import Reminders from './pages/Reminders';
import Settings from './pages/Settings';

// Layout
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

// Layout wrapper for authenticated pages
const AppLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 lg:ml-64">
                    {children}
                </main>
            </div>
        </div>
    );
};

function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
                <LoadingSpinner size="xl" />
            </div>
        );
    }

    return (
        <Routes>
            {/* Public Route */}
            <Route
                path="/auth"
                element={user ? <Navigate to="/dashboard" replace /> : <Auth />}
            />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Dashboard />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/transactions"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Transactions />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/analytics"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Analytics />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/budget"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Budget />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/family"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Family />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/recurring"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Recurring />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/savings"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Savings />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/reminders"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Reminders />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Settings />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default App;
