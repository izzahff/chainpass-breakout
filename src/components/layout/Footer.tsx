import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, ChevronRight } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Logo className="h-8 w-auto" />
              <span className="text-xl font-bold">ChainPass</span>
            </div>
            <p className="text-white/70 mb-4">
              Revolutionizing concert ticketing with blockchain technology.
              Secure, transparent, and user-friendly.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-primary"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-primary"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-primary"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Events', 'Marketplace', 'FAQ'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase()}`}
                    className="text-white/70 hover:text-primary flex items-center gap-1"
                  >
                    <ChevronRight size={16} />
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              {['Documentation', 'Tutorials', 'Blog', 'Support'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase()}`}
                    className="text-white/70 hover:text-primary flex items-center gap-1"
                  >
                    <ChevronRight size={16} />
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              {['Terms of Service', 'Privacy Policy', 'Refund Policy'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/legal/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-white/70 hover:text-primary flex items-center gap-1"
                  >
                    <ChevronRight size={16} />
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/60 text-sm">
          <p>© {new Date().getFullYear()} ChainPass. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;