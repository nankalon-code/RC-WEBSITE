import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiFetch } from '../utils/api';

const ensureAbsoluteUrl = (url) => {
  if (!url || url === '#') return '#';
  const clean = url.trim();
  if (/^(https?:)?\/\//i.test(clean)) return clean;
  return `https://${clean}`;
};

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

  // Custom static categorization based on the mockups to match the layout perfectly
  const categories = [
    {
      title: 'Getting started',
      items: [
        { title: 'MIT 2.12 Introduction to Robotics', type: 'COURSEWARE', link: 'https://ocw.mit.edu/courses/2-12-introduction-to-robotics-fall-2005/' },
        { title: 'HowToMechatronics Tutorials', type: 'WEBSITE', link: 'https://howtomechatronics.com/' },
        { title: 'Arduino Docs & Reference', type: 'DOCUMENTATION', link: 'https://docs.arduino.cc/' }
      ]
    },
    {
      title: 'Software',
      items: [
        { title: 'ROS 2 Humble Documentation', type: 'FRAMEWORK', link: 'https://docs.ros.org/en/humble/' },
        { title: 'OpenCV Library Tutorials', type: 'COMPUTER VISION', link: 'https://docs.opencv.org/4.x/d9/df8/tutorial_root.html' },
        { title: 'Modern Robotics Lynch & Park', type: 'BOOK & COURSE', link: 'https://modernrobotics.org/' }
      ]
    },
    {
      title: 'Hardware & IoT',
      items: [
        { title: 'ESP32 GPIO Pinout Guide', type: 'REFERENCE', link: 'https://randomnerdtutorials.com/esp32-pinout-reference-gpios/' },
        { title: 'KiCad Official PCB Tutorials', type: 'CAD MANUAL', link: 'https://www.kicad.org/help/tutorials/' },
        { title: 'SparkFun Electronics Learning', type: 'TUTORIALS', link: 'https://learn.sparkfun.com/' }
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
      type: res.tag ? res.tag.toUpperCase() : 'LINK',
      link: res.link || '#'
    });
  });

  // Merge API resources with static structure (append API items so both show up)
  const finalCategories = categories.map(cat => {
    const apiItems = groupedResources[cat.title] || [];
    return {
      title: cat.title,
      items: [...cat.items, ...apiItems]
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
                      href={ensureAbsoluteUrl(item.link)}
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
