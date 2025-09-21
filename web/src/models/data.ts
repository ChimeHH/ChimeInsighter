import { useCallback, useState } from 'react';

export default () => {
    const [projects, setProjects] = useState<Project[]>([]);

    const saveProjects = useCallback((data: Project[]) => {
        setProjects(data);
    }, []);

    return {
        projects,
        saveProjects,
    }
}