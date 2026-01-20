import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../api/api';
import StatCard from '../components/statCard';

const DashboardScreen = () => {
    const [stats, setStats] = useState({totalItems: 0, totalValue: 0 });
    const [dailyTrends, setDailyTrends] = useState([]);
    const[weeklyTrends, setWeeklyTrends]= useState([]);
    const[monthlyTrends, setMonthlyTrends]= useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        setError(null);
       
        try {

            const [dailyRes, weeklyRes, monthlyRes] = await Promise.all([
                api.get('/analytics/trends/daily'), 
                api.get('/analytics/trends/weekly'), 
                api.get('/analytics/trends/monthly')
              //  ,api.get('/items')
            ]);
            setDailyTrends(dailyRes.data);
            setWeeklyTrends(weeklyRes.data);
            setMonthlyTrends(monthlyRes.data);            
            const itemsRes = await api.get('/items',
                {params:{page:0,size: 1000}});

                const items =itemsRes.data.content;

                const totalItems= items.reduce((sum,item)=>sum + item.itemQuantity,0);
            const totalValue = items.reduce((sum,item)=>sum +(item.itemPrice*item.itemQuantity),0);
            setStats({
                totalItems, 
                totalValue 
            });
        } 
        catch (error) { console.error("Failed to fetch analytics", error);
             alert("Could not load analytics data."); 
            setError("Could not load dashboard data");
            setDailyTrends([]);
            setWeeklyTrends([]);
            setMonthlyTrends([]);
            setStats({totalItems:0,totalValue:0});
        } 
        finally { setLoading(false); }

    }, []);

    useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);
    
    const formatCurrency = (value) => `$${Number(value).toFixed(2)}`;

    if (loading) return <div className="text-center p-10 font-semibold text-gray-600">Loading dashboard...</div>;

    if(error){
        return <div className='text-center p-10 text-red-500 font-semibold' >
        {error}
        </div>;
    }

    return (
        <div className="space-y-8  ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
                <StatCard title="Total Items in Stock" value={stats.totalItems} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7  " fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>} />
                <StatCard title="Total Stock Value" value={formatCurrency(stats.totalValue)} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 " fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 13v-1m-4-6h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            </div>
            <div className="text-white p-6 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-30 ">
                <h3 className="text-xl font-bold text-white mb-4">Daily Sales (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" stroke='#FFFFFF' tick={{fill:'#ffffff'}} />
                        <YAxis tickFormatter={formatCurrency} stroke='#FFFFFF' tick={{fill:'#ffffff'}} />
                        <Tooltip formatter={(value) => [formatCurrency(value),"Sales"]} contentStyle={{backgroundColor:'#333',borderColor:'#555',color:'#ffffff'}} itemStyle={{color:'#ffffff'}} labelStyle={{color:'#ffffff'}}  />
                        <Legend wrapperStyle={{color:'#ffffff'}} />
                        <Line type="monotone" dataKey="total" stroke="#8884d8" name="Daily Sales" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="p-6 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-30">
                <h3 className="text-xl font-bold text-white mb-4">Weekly Sales (Last 4 Weeks)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" stroke='#FFFFFF' tick={{fill:'#ffffff'}} />
                       <YAxis tickFormatter={formatCurrency} stroke='#FFFFFF' tick={{fill:'#ffffff'}} />
                        <Tooltip formatter={(value) => [formatCurrency(value),"Sales"]} contentStyle={{backgroundColor:'#333',borderColor:'#555',color:'#ffffff'}} itemStyle={{color:'#ffffff'}} labelStyle={{color:'#ffffff'}}  />
                        <Legend wrapperStyle={{color:'#ffffff'}} />
                        <Bar dataKey="total" fill="#82ca9d" name="Weekly Sales" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
             <div className=" p-6 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-30 ">
                <h3 className="text-xl font-bold text-white mb-4">Monthly Sales (Last 12 Months)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke='#FFFFFF' tick={{fill:'#ffffff'}}/>
                    <YAxis tickFormatter={formatCurrency} stroke='#FFFFFF' tick={{fill:'#ffffff'}}/>
                    <Tooltip formatter={(value) => [formatCurrency(value),"Sales"]} contentStyle={{backgroundColor:'#333',borderColor:'#555',color:'#ffffff'}} itemStyle={{color:'#ffffff'}} labelStyle={{color:'#ffffff'}}  />
                        <Legend wrapperStyle={{color:'#ffffff'}} />
                    <Bar dataKey="total" fill="red" name="Monthly Sales" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
        </div>
    );
};

export default DashboardScreen;
