import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, User, Calendar, Clock, ArrowLeft, Star, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import Header from './Header';
import Footer from './Footer';

// Blog posts data
const blogPosts = [
  {
    id: 'health-tips-immune-system',
    title: 'Boost Your Immune System Naturally',
    excerpt: 'Discover simple, science-backed ways to strengthen your immune system through nutrition, exercise, and lifestyle changes.',
    content: `# Boost Your Immune System Naturally

Your immune system is your body's natural defense against illness and infection. Here are proven ways to strengthen it naturally.

## Key Strategies

### 1. Eat a Balanced Diet
- Focus on fruits and vegetables rich in vitamins C and E
- Include zinc-rich foods like nuts and seeds
- Stay hydrated with plenty of water

### 2. Get Regular Exercise
- Aim for 30 minutes of moderate exercise daily
- Walking, swimming, or cycling are excellent choices
- Exercise helps boost immune cell circulation

### 3. Prioritize Sleep
- Get 7-9 hours of quality sleep nightly
- Maintain a consistent sleep schedule
- Create a relaxing bedtime routine

## Conclusion

Building a strong immune system takes time and consistency. Focus on these fundamental habits for long-term health benefits.`,
    author: 'Dr. Sarah Johnson',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Health Tips',
    tags: ['immunity', 'nutrition', 'wellness', 'prevention'],
    image: '#22c55e'
  },
  {
    id: 'mental-wellness-daily-practices',
    title: 'Daily Practices for Mental Wellness',
    excerpt: 'Simple daily habits that can significantly improve your mental health and overall well-being.',
    content: `# Daily Practices for Mental Wellness

Mental wellness is just as important as physical health. Here are daily practices to support your mental well-being.

## Morning Practices

### Start with Gratitude
- Write down three things you're grateful for
- Focus on specific details
- Make it a consistent morning ritual

### Mindful Breathing
- Take 5 minutes for deep breathing
- Use the 4-7-8 technique
- Set intentions for the day

## Throughout the Day

### Regular Breaks
- Take short breaks every hour
- Step outside for fresh air
- Practice mini-meditations

### Connect with Others
- Reach out to friends and family
- Practice active listening
- Show kindness to strangers

## Evening Wind-Down

### Reflect on the Day
- Journal about positive moments
- Acknowledge challenges without judgment
- Plan for tomorrow

### Digital Detox
- Limit screen time before bed
- Create a phone-free bedroom
- Read or listen to calming music

## Conclusion

Small, consistent practices can lead to significant improvements in mental wellness. Start with one or two practices and gradually build your routine.`,
    author: 'Dr. Michael Chen',
    date: '2024-01-10',
    readTime: '7 min read',
    category: 'Mental Health',
    tags: ['mental-health', 'mindfulness', 'daily-habits', 'wellness'],
    image: '#3b82f6'
  },
  {
    id: 'prevention-early-detection',
    title: 'The Power of Prevention and Early Detection',
    excerpt: 'Learn why preventive care and early detection are crucial for maintaining long-term health and catching issues before they become serious.',
    content: `# The Power of Prevention and Early Detection

Prevention and early detection are the cornerstones of effective healthcare. Here's why they matter and how to implement them.

## Why Prevention Matters

### Cost-Effective Healthcare
- Prevents expensive treatments later
- Reduces hospital admissions
- Improves quality of life

### Better Outcomes
- Catches issues early when treatable
- Prevents complications
- Maintains independence longer

## Key Preventive Measures

### Regular Check-ups
- Annual physical examinations
- Age-appropriate screenings
- Dental and eye care

### Vaccinations
- Stay up-to-date with immunizations
- Seasonal flu shots
- Travel vaccinations when needed

### Lifestyle Modifications
- Healthy diet and regular exercise
- Stress management
- Avoiding harmful substances

## Early Detection Strategies

### Know Your Family History
- Understand genetic risk factors
- Share information with healthcare providers
- Plan appropriate screening schedules

### Self-Examinations
- Monthly breast or testicular self-exams
- Skin checks for changes in moles
- Monitor changes in your body

### Regular Screenings
- Mammograms and colonoscopies
- Blood pressure and cholesterol checks
- Diabetes screening

## Taking Action

### Work with Your Healthcare Team
- Build relationships with providers
- Ask questions and voice concerns
- Follow through with recommendations

### Stay Informed
- Learn about your health conditions
- Understand your medications
- Keep accurate health records

## Conclusion

Investing in prevention and early detection today can save your life tomorrow. Take charge of your health by being proactive rather than reactive.`,
    author: 'Dr. Lisa Rodriguez',
    date: '2024-01-05',
    readTime: '6 min read',
    category: 'Prevention',
    tags: ['prevention', 'early-detection', 'screening', 'healthcare'],
    image: '#8b5cf6'
  }
];

const categories = ['All', 'Health Tips', 'Mental Health', 'Prevention', 'Nutrition', 'Exercise'];

const BlogPage: React.FC = () => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Handle hash changes for navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1) || 'home';
      setActiveSection(hash);
      
      // Scroll to the section if it exists
      const section = document.getElementById(hash);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // Initial check
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Handle navigation to a section
  const handleNavigate = (section: string) => {
    // If we're on the blog page, navigate back to the main site with the hash
    if (window.location.pathname.includes('/whoisyomama')) {
      // Store the section we're navigating to in session storage
      const targetSection = section === 'home' ? 'hero' : section;
      sessionStorage.setItem('navigatingToSection', targetSection);
      
      // Force a full page reload to ensure the main site loads properly
      window.location.href = `/#${targetSection}`;
      
      // Force scroll to top to ensure we can scroll to the section
      window.scrollTo(0, 0);
    } else {
      // On main site, just update the hash (handle 'home' as 'hero')
      const targetSection = section === 'home' ? 'hero' : section;
      window.location.hash = `#${targetSection}`;
      
      // Scroll to the section
      const element = document.getElementById(targetSection);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Filter posts based on search term and category
  useEffect(() => {
    let filtered = blogPosts;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory]);

  return (
    <div className={`min-h-screen transition-all duration-700 ease-in-out ${
      isDark ? 'bg-gray-900' : 'bg-white'
    } ${
      isSidebarCollapsed ? 'lg:ml-24' : 'lg:ml-64'
    } ${
      isSidebarCollapsed ? 'lg:w-[calc(100%-6rem)]' : 'lg:w-[calc(100%-16rem)]'
    }`} style={{
      transition: 'margin-left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }}>
      <Header 
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      {/* Clean Hero Section */}
      <section className={`relative py-20 border-b ${
        isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
      }`}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`text-4xl md:text-6xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Health & Wellness Blog
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-xl mb-8 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Expert insights, tips, and guidance for your health journey
            </motion.p>
            
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative max-w-md mx-auto mb-8"
            >
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className={`py-12 border-b ${
        isDark ? 'border-gray-800 bg-gray-800' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-3">
              <Filter size={24} className={`${isDark ? 'text-green-400' : 'text-green-500'}`} />
              <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Explore by Category
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-green-500 text-white shadow-lg'
                      : isDark
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {filteredPosts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                isDark ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <Search size={32} className={isDark ? 'text-gray-600' : 'text-gray-400'} />
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                No Articles Found
              </h3>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Try adjusting your search criteria or explore different categories.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className={`group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  {/* Article Image */}
                  <div 
                    className="h-48 flex items-center justify-center text-white text-xl font-bold"
                    style={{ backgroundColor: post.image }}
                  >
                    {post.category}
                  </div>
                  
                  {/* Article Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <div className="mb-4">
                      <span 
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: post.image }}
                      >
                        {post.category}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h2 className={`text-xl font-bold mb-3 line-clamp-2 group-hover:text-green-500 transition-colors ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {post.title}
                    </h2>
                    
                    {/* Excerpt */}
                    <p className={`text-sm mb-4 line-clamp-3 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {post.excerpt}
                    </p>
                    
                    {/* Meta Information */}
                    <div className={`flex items-center gap-4 text-xs mb-4 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Read More Button */}
                    <Link
                      to={`/whoisyomama/${post.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300 group"
                    >
                      <BookOpen size={16} />
                      Read Article
                      <ArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" size={16} />
                    </Link>
                    
                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 mt-3">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={`${i < 4 ? 'text-yellow-400 fill-current' : isDark ? 'text-gray-600' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className={`text-xs ml-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        4.8 (127 reviews)
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;
