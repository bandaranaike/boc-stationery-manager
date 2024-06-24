import { useState, useEffect } from 'react';
import axios from 'axios';
import {set} from "react-hook-form";

interface Setting {
    id: number;
    name: string;
    value: string;
}

export default function Settings() {
    const [settings, setSettings] = useState<Setting[]>([]);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('/api/settings');
                setSettings(response.data);
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const { name, value } = e.target;
        setSettings(prevSettings => prevSettings.map(setting =>
            setting.id === id ? { ...setting, value } : setting
        ));

        try {
            await axios.post('/api/saveSettings', { id, value });
        } catch (error) {
            console.error('Failed to save setting:', error);
        }
    };

    return (
        <div className="bg-gray-900 text-white h-screen p-8">
            <div className="grid grid-cols-2 gap-4">
                {settings.map((setting) => (
                    <div key={setting.id}>
                        <label htmlFor={setting.name} className="block text-sm font-medium text-gray-300">
                            {setting.name}
                        </label>
                        <input
                            type="text"
                            name={setting.name}
                            id={setting.name}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            value={setting.value}
                            onChange={(e) => handleChange(e, setting.id)}
                        />
                    </div>
                ))}
                {!settings.length && (<div className="p-8 text-xl text-gray-600">Settings will appear here</div>)}
            </div>
        </div>
    );
}
