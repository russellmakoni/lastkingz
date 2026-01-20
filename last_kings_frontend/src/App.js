
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './screens/main';
import AuthScreen from './screens/AuthScreen';
import LoadingSpinner from './components/loadspinner';


// The Root component decides whether to show the login screen or the main app.
const AuthCunt = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return user ? <MainLayout /> : <AuthScreen />;
};

// The App component wraps the entire application with the AuthProvider.
function App() {
    return (
        <div className='relative min-h-screen font sans' >
        <div className='bg-[url(/public/alcohol.png)] bg-cover absolute inset-0 z-0 bg-fixed bg-no-repeat bg-centre aria-hidden="true" ' ></div>
        <div className='relative z-10-min-h-screen'>
      
        <AuthProvider>
            <AuthCunt/>
        </AuthProvider>
    
        </div>
        </div>
    );
}


export default App;