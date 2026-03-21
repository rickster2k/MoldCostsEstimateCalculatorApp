type AdminTabSelectorProps = {
    setter: (tab: string) => void,
    activeTab: string
}
export default function AdminTabSelector({setter ,activeTab}:AdminTabSelectorProps){
    return (
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg mb-6 w-fit">
            <button onClick={() => setter('submissions')} className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'submissions' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Submissions</button>
            <button onClick={() => setter('serviceAlerts')} className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'serviceAlerts' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Service Alert Requests</button>
            <button onClick={() => setter('settings')} className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'settings' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Settings</button>
      </div>
    )
}