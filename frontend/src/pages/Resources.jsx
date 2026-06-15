import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiFetch } from '../utils/api';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/resources')
      .then((data) => {
        setResources(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load resources:", err);
        setLoading(false);
      });
  }, []);

  // Custom static categorization based on the mockups to match the layout perfectly, 
  // falling back to api data categories if available.
  const categories = [
    {
      title: 'Getting started',
      items: [
        { title: 'Arduino in 10 minutes', type: 'TUTORIAL · PDF', link: '#' },
        { title: 'Soldering, properly', type: 'WORKSHOP VIDEO', link: '#' },
        { title: 'Reading a datasheet', type: 'CHEATSHEET', link: '#' }
      ]
    },
    {
      title: 'Software',
      items: [
        { title: 'ROS2 cheatsheet', type: 'PDF', link: '#' },
        { title: 'OpenCV starter repo', type: 'GITHUB', link: '#' },
        { title: 'PID tuning notebook', type: 'JUPYTER', link: '#' }
      ]
    },
    {
      title: 'Hardware & IoT',
      items: [
        { title: 'Approved vendor list', type: 'SHEET', link: '#' },
        { title: 'ESP32 reference designs', type: 'KICAD', link: '#' },
        { title: 'Motor selection guide', type: 'DOC', link: '#' }
      ]
    }
  ];

  // If there are resources from the API, we can group/append them dynamically too
  const groupedResources = {
    'Getting started': [],
    'Software': [],
    'Hardware & IoT': []
  };

  resources.forEach(res => {
    const cat = res.category || 'Getting started';
    if (!groupedResources[cat]) {
      groupedResources[cat] = [];
    }
    groupedResources[cat].push({
      title: res.title,
      type: res.type ? res.type.toUpperCase() : 'LINK',
      link: res.link_url || '#'
    });
  });

  // Merge API resources with static structure
  const finalCategories = categories.map(cat => {
    const apiItems = groupedResources[cat.title] || [];
    return {
      title: cat.title,
      items: apiItems.length > 0 ? apiItems : cat.items
    };
  });

  return (
    <div className="rc-root">
      <section className="rc-page-section">
        <div className="rc-section-inner">
          {/* Header */}
          <div className="rc-page-header">
            <span className="rc-tag-sub uppercase tracking-[0.25em] text-red-500 font-mono block mb-2">RESOURCES</span>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-black tracking-tight leading-none">
              Curated, battle-tested.
            </h1>
          </div>

          {/* Grid */}
          <div className="rc-resources-grid">
            {finalCategories.map((cat, i) => (
              <motion.div
                key={cat.title}
                className="rc-resource-group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <h2 className="rc-resource-group-title">{cat.title}</h2>
                <div className="rc-resource-items">
                  {cat.items.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rc-resource-item"
                    >
                      <span className="rc-resource-item-name">{item.title}</span>
                      <span className="rc-resource-item-meta">
                        {item.type} <span className="rc-resource-arrow">→</span>
                      </span>
                    </a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
