import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiFetch } from '../utils/api';
import { Card } from '../components/ui/Card';
import { Book, Code, ExternalLink, Download } from 'lucide-react';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/resources')
      .then((data) => {
        setResources(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load resources:", err);
        setLoading(false);
      });
  }, []);

  const getIcon = (type) => {
    switch(type) {
      case 'document': return <Book size={20} className="text-primary-var" />;
      case 'code': return <Code size={20} className="text-accent" />;
      default: return <ExternalLink size={20} className="text-secondary" />;
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16 px-6 max-w-7xl mx-auto relative z-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-var mb-4">Resources Hub</h1>
        <p className="text-muted-var max-w-2xl">Find all club learning guides, code files, and study resources in one place.</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-20 text-muted-var">No resources found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, i) => (
            <motion.div 
              key={resource.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
            >
              <a href={resource.link_url} target="_blank" rel="noopener noreferrer" className="block h-full">
                <Card className="h-full flex flex-col p-6 hover-tilt glass-card-hover cursor-pointer border-var">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-var border border-var flex items-center justify-center shadow-inner">
                      {getIcon(resource.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-primary-var line-clamp-1">{resource.title}</h3>
                      <span className="text-xs uppercase tracking-widest text-muted-var font-mono">{resource.type}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-var mb-6 flex-grow leading-relaxed">
                    {resource.description}
                  </p>

                  <div className="flex justify-end border-t border-var pt-4 mt-auto">
                    <span className="text-xs font-bold text-accent flex items-center gap-2 hover:underline">
                      Access Resource <ExternalLink size={14} />
                    </span>
                  </div>
                </Card>
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
