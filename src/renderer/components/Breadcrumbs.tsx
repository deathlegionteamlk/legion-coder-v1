import React from 'react';
import { ChevronRight, Folder, FileCode, Home } from 'lucide-react';

interface BreadcrumbsProps {
path: string;
onNavigate: (path: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ path, onNavigate }) => {
if (!path) return null;

const parts = path.split(/[\\/]/).filter(Boolean);
const breadcrumbs = parts.map((part, index) => {
const currentPath = parts.slice(0, index + 1).join('/');
return { name: part, path: currentPath, isLast: index === parts.length - 1 };
});

return (
<div className="flex items-center space-x-1 px-4 py-2 bg-white/5 border-b border-white/10 overflow-x-auto">
<button
onClick={() => onNavigate('')}
className="flex items-center text-gray-400 hover:text-white transition-colors"
>
<Home className="w-4 h-4" />
</button>

{breadcrumbs.map((crumb, index) => (
<React.Fragment key={crumb.path}>
<ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
<button
onClick={() => !crumb.isLast && onNavigate(crumb.path)}
className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors flex-shrink-0 ${
crumb.isLast
? 'text-white bg-white/10'
: 'text-gray-400 hover:text-white hover:bg-white/5'
}`}
>
{crumb.isLast ? (
<FileCode className="w-4 h-4" />
) : (
<Folder className="w-4 h-4" />
)}
<span className="text-sm">{crumb.name}</span>
</button>
</React.Fragment>
))}
</div>
);
};