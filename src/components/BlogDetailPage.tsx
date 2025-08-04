import React, { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Share2, BookmarkPlus, Heart } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Header from './Header';
import Footer from './Footer';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: 'health-tips-immune-system',
    title: 'Boost Your Immune System Naturally',
    excerpt: 'Discover proven natural methods to strengthen your immune system and maintain optimal health throughout the year.',
    content: `Your immune system is your body's natural defense against illness and disease. By making simple lifestyle changes, you can significantly boost your immune function and improve your overall health.

## Key Strategies for Immune Health

### 1. Nutrition is Foundation
A balanced diet rich in vitamins and minerals is crucial for immune function. Focus on:
- Vitamin C from citrus fruits, berries, and leafy greens
- Vitamin D from sunlight exposure and fortified foods
- Zinc from nuts, seeds, and lean proteins
- Antioxidants from colorful fruits and vegetables

### 2. Quality Sleep Matters
Getting 7-9 hours of quality sleep each night allows your body to:
- Produce infection-fighting cells
- Release important hormones
- Repair and regenerate tissues
- Consolidate immune memory

### 3. Regular Exercise
Moderate exercise boosts immune function by:
- Increasing circulation of immune cells
- Reducing inflammation
- Managing stress hormones
- Improving overall cardiovascular health

### 4. Stress Management
Chronic stress weakens immunity. Try:
- Meditation and mindfulness practices
- Deep breathing exercises
- Regular physical activity
- Connecting with loved ones

### 5. Stay Hydrated
Proper hydration supports:
- Lymphatic system function
- Nutrient transport
- Toxin elimination
- Mucous membrane health

## Conclusion
Building a strong immune system is a lifestyle choice that pays dividends in better health and vitality. Start with small changes and build healthy habits over time.`,
    author: 'Dr. Sarah Johnson',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Health Tips',
    image: '#22c55e',
    tags: ['immunity', 'nutrition', 'wellness', 'prevention']
  },
  {
    id: 'insurance-guide-medical-aid',
    title: 'Understanding Your Medical Aid Benefits',
    excerpt: 'A comprehensive guide to maximizing your medical aid benefits and understanding what coverage you have.',
    content: `Medical aid can be complex, but understanding your benefits is crucial for making informed healthcare decisions and managing costs effectively.

## Types of Medical Aid Plans

### Hospital Plans
- Cover in-hospital treatment
- Emergency medical care
- Specialist consultations in hospital
- Surgical procedures

### Comprehensive Plans
- Include hospital benefits
- Day-to-day medical expenses
- Chronic medication
- Preventive care

### Savings Plans
- Hospital cover plus medical savings account
- Flexibility in spending
- Unused funds roll over

## Key Benefits to Understand

### Prescribed Minimum Benefits (PMBs)
- Emergency medical conditions
- Chronic disease list conditions
- Cancer treatment
- Mental health conditions

### Annual Limits and Sub-limits
- Overall annual benefit limit
- Sub-limits for specific services
- Out-of-hospital benefits
- Specialist consultation limits

### Co-payments and Deductibles
- When you pay additional amounts
- How to minimize out-of-pocket costs
- Understanding your scheme's rules

## Making the Most of Your Benefits

### 1. Know Your Plan Details
- Read your benefit guide
- Understand your coverage levels
- Know your network providers

### 2. Use Preventive Care
- Annual health screenings
- Vaccinations
- Wellness programs
- Early detection saves money

### 3. Manage Chronic Conditions
- Register for chronic benefits
- Use designated service providers
- Follow treatment protocols
- Monitor your benefits usage

### 4. Emergency Procedures
- Know your emergency numbers
- Understand pre-authorization requirements
- Keep your membership details handy

## Conclusion
Understanding your medical aid benefits empowers you to make better healthcare decisions and avoid unexpected costs. Take time to review your plan annually and make adjustments as needed.`,
    author: 'Michael Chen',
    date: '2024-01-10',
    readTime: '7 min read',
    category: 'Insurance Guide',
    image: '#3b82f6',
    tags: ['medical aid', 'insurance', 'benefits', 'healthcare']
  },
  {
    id: 'latest-news-healthcare-trends',
    title: 'Healthcare Trends Shaping 2024',
    excerpt: 'Explore the latest developments in healthcare technology and how they\'re improving patient care and outcomes.',
    content: `The healthcare industry is rapidly evolving with new technologies and approaches that are transforming patient care and improving health outcomes.

## Major Healthcare Trends

### 1. Telemedicine Expansion
The rise of virtual healthcare has revolutionized access to medical care:
- Remote consultations becoming mainstream
- Improved access for rural communities
- Cost-effective healthcare delivery
- Integration with traditional care models

### 2. AI and Machine Learning
Artificial intelligence is enhancing healthcare in multiple ways:
- Diagnostic accuracy improvements
- Predictive analytics for patient outcomes
- Drug discovery acceleration
- Personalized treatment plans

### 3. Wearable Health Technology
Consumer health devices are providing valuable health data:
- Continuous health monitoring
- Early warning systems
- Lifestyle behavior insights
- Integration with healthcare providers

### 4. Mental Health Focus
Increased attention to mental wellness:
- Destigmatization of mental health issues
- Integrated mental health services
- Digital mental health platforms
- Workplace wellness programs

### 5. Preventive Care Emphasis
Shift towards prevention rather than treatment:
- Health screenings and check-ups
- Lifestyle medicine approaches
- Community health initiatives
- Wellness program expansion

## Impact on Patients

### Better Access
- 24/7 healthcare availability
- Reduced travel requirements
- Faster appointment scheduling
- Multiple communication channels

### Improved Outcomes
- Earlier disease detection
- More accurate diagnoses
- Personalized treatment approaches
- Better medication adherence

### Cost Savings
- Reduced hospital readmissions
- Lower emergency room visits
- More efficient care delivery
- Preventive care cost benefits

## Looking Ahead
Healthcare will continue evolving with patient-centered approaches, technology integration, and focus on value-based care. These trends promise better health outcomes and more accessible, affordable healthcare for all.

## Conclusion
Staying informed about healthcare trends helps patients make better decisions about their health and take advantage of new opportunities for improved care and wellness.`,
    author: 'Dr. Lisa Rodriguez',
    date: '2024-01-05',
    readTime: '6 min read',
    category: 'Latest News',
    image: '#1f2937',
    tags: ['healthcare', 'technology', 'trends', 'innovation']
  },
  {
    id: 'mental-wellness-daily-practices',
    title: 'Daily Practices for Mental Wellness',
    excerpt: 'Simple, effective strategies you can implement daily to support your mental health and emotional well-being.',
    content: `Mental wellness is just as important as physical health. Incorporating daily practices can significantly improve your emotional well-being and resilience.

## Foundation Practices

### Morning Routine
Start your day with intention:
- Mindful awakening (avoid checking phone immediately)
- Gratitude practice (3 things you're grateful for)
- Light stretching or movement
- Healthy breakfast and hydration

### Mindfulness and Meditation
Even 5-10 minutes daily can help:
- Reduce stress and anxiety
- Improve focus and concentration
- Enhance emotional regulation
- Increase self-awareness

### Physical Activity
Exercise is medicine for the mind:
- Releases endorphins (natural mood boosters)
- Reduces stress hormones
- Improves sleep quality
- Builds confidence and self-esteem

## Stress Management Techniques

### Breathing Exercises
Simple techniques for immediate relief:
- 4-7-8 breathing (inhale 4, hold 7, exhale 8)
- Box breathing (4-4-4-4 pattern)
- Diaphragmatic breathing
- Progressive muscle relaxation

### Cognitive Strategies
Reframe negative thinking:
- Challenge negative thoughts
- Practice self-compassion
- Focus on what you can control
- Use positive affirmations

### Social Connection
Maintain meaningful relationships:
- Regular check-ins with friends/family
- Join community groups or activities
- Practice active listening
- Seek support when needed

## Evening Wind-Down

### Digital Boundaries
- Set phone/screen curfews
- Create tech-free zones
- Use blue light filters
- Practice digital detox periods

### Reflection and Planning
- Journal about your day
- Plan tomorrow's priorities
- Practice gratitude
- Set intentions for rest

### Sleep Hygiene
- Consistent sleep schedule
- Cool, dark sleeping environment
- Comfortable bedding
- Relaxation techniques before bed

## Building Resilience

### Self-Care Practices
- Regular breaks during work
- Engage in hobbies you enjoy
- Spend time in nature
- Practice saying "no" to overcommitment

### Professional Support
Know when to seek help:
- Persistent sadness or anxiety
- Changes in sleep or appetite
- Difficulty functioning daily
- Thoughts of self-harm

## Conclusion
Mental wellness is an ongoing practice, not a destination. Start small, be consistent, and be patient with yourself as you develop these healthy habits.`,
    author: 'Dr. James Wilson',
    date: '2024-01-12',
    readTime: '8 min read',
    category: 'Mental Wellness',
    image: '#22c55e',
    tags: ['mental health', 'wellness', 'mindfulness', 'self-care']
  },
  {
    id: 'family-care-health-planning',
    title: 'Family Health Planning Essentials',
    excerpt: 'Create a comprehensive health plan for your family that covers prevention, emergencies, and long-term wellness goals.',
    content: `Planning for your family's health needs requires thoughtful consideration of everyone's unique requirements and life stages.

## Family Health Assessment

### Individual Health Profiles
Create profiles for each family member including:
- Current health status and conditions
- Medications and allergies
- Vaccination records
- Family medical history
- Lifestyle factors and risk factors

### Age-Specific Considerations
Different life stages require different approaches:
- Infants and toddlers: developmental milestones, immunizations
- School-age children: sports physicals, vision/hearing checks
- Teenagers: mental health, reproductive health education
- Adults: preventive screenings, chronic disease management
- Seniors: fall prevention, medication management

## Preventive Care Planning

### Regular Check-ups
Establish schedules for:
- Annual physical exams
- Dental cleanings and check-ups
- Eye exams
- Specialist consultations as needed

### Screening Guidelines
Stay current with recommended screenings:
- Blood pressure and cholesterol
- Cancer screenings (mammograms, colonoscopies)
- Bone density tests
- Mental health assessments

### Immunizations
Keep vaccination records updated:
- Childhood immunization schedules
- Annual flu shots
- Travel vaccinations
- Adult boosters (tetanus, etc.)

## Emergency Preparedness

### Medical Information
Keep readily accessible:
- Emergency contact numbers
- Medical alert information
- Insurance cards and policy numbers
- List of current medications
- Copies of important medical records

### First Aid Preparedness
- Well-stocked first aid kit
- Basic first aid training for adults
- Emergency action plans
- Knowledge of nearest emergency facilities

### Medication Management
- Organize medications safely
- Track expiration dates
- Understand drug interactions
- Have emergency medication supplies

## Lifestyle and Wellness

### Nutrition Planning
- Family meal planning
- Healthy snack options
- Special dietary needs accommodation
- Teaching children about nutrition

### Physical Activity
- Family exercise activities
- Age-appropriate sports and activities
- Limiting screen time
- Outdoor recreation planning

### Mental Health Support
- Open communication about feelings
- Stress management techniques
- Professional counseling when needed
- Building resilience and coping skills

## Healthcare Provider Relationships

### Primary Care
- Establish relationships with family doctors
- Understand when to see specialists
- Maintain good communication with providers
- Keep updated contact information

### Insurance and Costs
- Understand your coverage
- Plan for healthcare expenses
- Use preventive care benefits
- Consider health savings accounts

## Documentation and Records

### Health Records Organization
- Digital and physical record keeping
- Sharing information between providers
- Travel health documentation
- Emergency medical information

## Conclusion
A comprehensive family health plan provides peace of mind and ensures everyone receives appropriate care. Review and update your plan annually or when circumstances change.`,
    author: 'Dr. Maria Santos',
    date: '2024-01-08',
    readTime: '9 min read',
    category: 'Family Care',
    image: '#3b82f6',
    tags: ['family health', 'planning', 'prevention', 'wellness']
  },
  {
    id: 'prevention-early-detection',
    title: 'The Power of Prevention and Early Detection',
    excerpt: 'Learn how preventive care and early detection can save lives, reduce healthcare costs, and improve quality of life.',
    content: `Prevention and early detection are the cornerstones of modern healthcare, offering the best outcomes at the lowest costs.

## Understanding Prevention

### Primary Prevention
Preventing disease before it occurs:
- Healthy lifestyle choices
- Vaccinations and immunizations
- Environmental safety measures
- Injury prevention strategies

### Secondary Prevention
Early detection and treatment:
- Regular health screenings
- Self-examinations
- Routine check-ups
- Diagnostic testing

### Tertiary Prevention
Managing existing conditions:
- Treatment compliance
- Rehabilitation programs
- Lifestyle modifications
- Preventing complications

## Key Screening Guidelines

### Cancer Screenings
Early detection saves lives:
- Mammograms for breast cancer (age 40-50+)
- Pap smears for cervical cancer (age 21+)
- Colonoscopies for colorectal cancer (age 45-50+)
- Skin cancer checks (annual or as recommended)

### Cardiovascular Health
- Blood pressure monitoring
- Cholesterol testing
- Heart disease risk assessment
- Diabetes screening

### Other Important Screenings
- Bone density tests (osteoporosis)
- Vision and hearing tests
- Mental health assessments
- STD testing (as appropriate)

## Lifestyle Prevention Strategies

### Nutrition and Diet
- Balanced, nutrient-rich meals
- Limiting processed foods
- Adequate fiber intake
- Maintaining healthy weight

### Physical Activity
- Regular aerobic exercise
- Strength training
- Flexibility and balance work
- Reducing sedentary time

### Avoiding Risk Factors
- No smoking or tobacco use
- Limiting alcohol consumption
- Sun protection and skin care
- Safe driving and injury prevention

## Benefits of Preventive Care

### Health Outcomes
- Earlier treatment leads to better outcomes
- Reduced disease severity
- Improved quality of life
- Increased life expectancy

### Economic Benefits
- Lower healthcare costs overall
- Reduced need for expensive treatments
- Less time off work due to illness
- Lower insurance premiums

### Personal Benefits
- Peace of mind
- Better health awareness
- Improved self-care habits
- Stronger doctor-patient relationships

## Overcoming Barriers

### Common Obstacles
- Cost concerns
- Time constraints
- Fear or anxiety about results
- Lack of symptoms (feeling healthy)

### Solutions
- Use insurance preventive benefits
- Schedule annual appointments in advance
- Discuss concerns with healthcare providers
- Remember that prevention is investment in future health

## Technology and Prevention

### Wearable Devices
- Activity tracking
- Heart rate monitoring
- Sleep quality assessment
- Health trend identification

### Health Apps
- Medication reminders
- Symptom tracking
- Appointment scheduling
- Health education resources

### Telemedicine
- Remote consultations
- Follow-up care
- Health monitoring
- Medication management

## Building a Prevention Plan

### Personal Risk Assessment
- Family history evaluation
- Lifestyle factor analysis
- Environmental risk identification
- Age and gender considerations

### Creating Your Schedule
- Annual physical exams
- Recommended screening timelines
- Vaccination schedules
- Specialist consultations

### Tracking and Documentation
- Health record maintenance
- Screening result tracking
- Medication and supplement logs
- Symptom and health change notes

## Conclusion
Investing in prevention and early detection is one of the most important decisions you can make for your health. Work with your healthcare team to develop a personalized prevention plan that fits your needs and risk factors.`,
    author: 'Dr. Robert Kim',
    date: '2024-01-03',
    readTime: '10 min read',
    category: 'Prevention',
    image: '#1f2937',
    tags: ['prevention', 'screening', 'early detection', 'health']
  }
];

const BlogDetailPage: React.FC = () => {
  const { isDark } = useTheme();
  const { id } = useParams<{ id: string }>();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const post = blogPosts.find(p => p.id === id);
  
  if (!post) {
    return <Navigate to="/whoisyomama" replace />;
  }

  // Function to render markdown-like content
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentKey = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={currentKey++} className={`text-2xl font-bold mt-8 mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={currentKey++} className={`text-xl font-semibold mt-6 mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('- ')) {
        // Look ahead to collect all list items
        const listItems = [];
        let j = i;
        while (j < lines.length && lines[j].startsWith('- ')) {
          listItems.push(lines[j].replace('- ', ''));
          j++;
        }
        
        elements.push(
          <ul key={currentKey++} className={`list-disc list-inside mb-4 space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {listItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
        
        i = j - 1; // Skip the processed lines
      } else if (line.trim() === '') {
        // Skip empty lines
        continue;
      } else {
        elements.push(
          <p key={currentKey++} className={`mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {line}
          </p>
        );
      }
    }
    
    return elements;
  };

  // Get related posts (same category, excluding current post)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div 
      className={`min-h-screen transition-all duration-700 ease-in-out ${
        isDark ? 'bg-gray-900' : 'bg-white'
      } ${
        isSidebarCollapsed ? 'lg:ml-24' : 'lg:ml-64'
      } ${
        isSidebarCollapsed ? 'lg:w-[calc(100%-6rem)]' : 'lg:w-[calc(100%-16rem)]'
      }`} 
      style={{
        transition: 'margin-left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      <Header 
        activeSection="blog"
        onNavigate={() => {}}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      
      {/* Hero Section with Gradient Background */}
      <section className={`relative py-20 overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-green-900' 
          : 'bg-gradient-to-br from-white via-green-50 to-blue-50'
      }`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
            isDark ? 'bg-green-500' : 'bg-green-300'
          }`} style={{ animation: 'float 6s ease-in-out infinite' }} />
          <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20 ${
            isDark ? 'bg-blue-500' : 'bg-blue-300'
          }`} style={{ animation: 'float 8s ease-in-out infinite reverse' }} />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Navigation */}
            <div className="mb-8">
              <Link
                to="/whoisyomama"
                className="inline-flex items-center text-center w-32 rounded-xl h-10 relative text-sm font-semibold group bg-gray-800 text-white"
              >
                <div className="bg-green-400 rounded-lg h-8 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[120px] z-10 duration-500">
                  <ArrowLeft size={16} className="text-black" />
                </div>
                <span className="translate-x-1">Back to Blog</span>
              </Link>
            </div>
            
            {/* Category Badge */}
            <div className="mb-6">
              <span 
                className="inline-block px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg"
                style={{ backgroundColor: post.image }}
              >
                {post.category}
              </span>
            </div>
            
            {/* Title */}
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 leading-tight ${
              isDark 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-green-400' 
                : 'text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-green-600'
            }`}>
              {post.title}
            </h1>
            
            {/* Excerpt */}
            <p className={`text-xl md:text-2xl leading-relaxed mb-8 max-w-3xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {post.excerpt}
            </p>
            
            {/* Meta Information */}
            <div className={`flex items-center justify-center gap-6 text-sm mb-8 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <div className="flex items-center gap-2">
                <User size={16} />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{post.readTime}</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                isDark 
                  ? 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm' 
                  : 'bg-white/80 text-gray-700 hover:bg-white backdrop-blur-sm shadow-lg hover:shadow-xl'
              }`}>
                <Heart size={18} />
                <span>Like Article</span>
              </button>
              <button className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                isDark 
                  ? 'bg-green-600 text-white hover:bg-green-500' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              } shadow-lg hover:shadow-xl transform hover:scale-105`}>
                <BookmarkPlus size={18} />
                <span>Save for Later</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content Area */}
      <article className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            <div className="relative mb-16">
              <div 
                className="w-full h-64 md:h-96 rounded-3xl shadow-2xl flex items-center justify-center text-white text-3xl font-bold relative overflow-hidden"
                style={{ backgroundColor: post.image }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="relative z-10">{post.category}</span>
              </div>
              
              {/* Floating Action Bar */}
              <div className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-full shadow-xl backdrop-blur-sm ${
                isDark ? 'bg-gray-800/90' : 'bg-white/90'
              }`}>
                <button className={`p-2 rounded-full transition-colors ${
                  isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}>
                  <Heart size={20} />
                </button>
                <button className={`p-2 rounded-full transition-colors ${
                  isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}>
                  <BookmarkPlus size={20} />
                </button>
                <button className={`p-2 rounded-full transition-colors ${
                  isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}>
                  <Share2 size={20} />
                </button>
              </div>
            </div>
            
            {/* Content Grid Layout with Wider Sidebar */}
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Tags */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                        isDark 
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                {/* Article Content with Better Typography */}
                <div className={`prose prose-lg max-w-none ${
                  isDark 
                    ? 'prose-invert prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-li:text-gray-300' 
                    : 'prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-li:text-gray-700'
                } prose-headings:font-bold prose-p:leading-relaxed prose-li:leading-relaxed`}>
                  {renderContent(post.content)}
                </div>
              </div>
              
              {/* Sidebar - Wider */}
              <div className="lg:col-span-2">
                {/* Author Card */}
                <div className={`p-6 rounded-2xl mb-8 ${
                  isDark ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <h3 className={`text-lg font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>About the Author</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <p className={`font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{post.author}</p>
                      <p className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>Health Expert</p>
                    </div>
                  </div>
                  <p className={`text-sm leading-relaxed ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Passionate about making healthcare accessible and affordable for all South Africans.
                  </p>
                </div>
                
                {/* Table of Contents */}
                <div className={`p-6 rounded-2xl mb-8 ${
                  isDark ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <h3 className={`text-lg font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>In This Article</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className={`text-sm hover:text-green-500 transition-colors ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>Introduction</a>
                    </li>
                    <li>
                      <a href="#" className={`text-sm hover:text-green-500 transition-colors ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>Key Benefits</a>
                    </li>
                    <li>
                      <a href="#" className={`text-sm hover:text-green-500 transition-colors ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>How to Get Started</a>
                    </li>
                    <li>
                      <a href="#" className={`text-sm hover:text-green-500 transition-colors ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>Conclusion</a>
                    </li>
                  </ul>
                </div>
                
                {/* Share Widget */}
                <div className={`p-6 rounded-2xl ${
                  isDark ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <h3 className={`text-lg font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Share Article</h3>
                  <div className="flex gap-3">
                    <button className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                      <Share2 size={16} />
                    </button>
                    <button className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                      <Share2 size={16} />
                    </button>
                    <button className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
      
      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className={`py-16 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className={`text-2xl md:text-3xl font-bold mb-12 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Related Articles
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.id}
                    className={`group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                      isDark ? 'bg-gray-700' : 'bg-white'
                    }`}
                  >
                    {/* Article Image */}
                    <div 
                      className="h-48 flex items-center justify-center text-white text-xl font-bold"
                      style={{ backgroundColor: relatedPost.image }}
                    >
                      {relatedPost.category}
                    </div>
                    
                    {/* Article Content */}
                    <div className="p-6">
                      {/* Category Badge */}
                      <div className="mb-3">
                        <span 
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: relatedPost.image }}
                        >
                          {relatedPost.category}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className={`text-lg font-bold mb-3 line-clamp-2 group-hover:text-green-500 transition-colors ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {relatedPost.title}
                      </h3>
                      
                      {/* Excerpt */}
                      <p className={`text-sm mb-4 line-clamp-3 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {relatedPost.excerpt}
                      </p>
                      
                      {/* Meta Info */}
                      <div className={`flex items-center gap-4 text-xs mb-4 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <div className="flex items-center gap-1">
                          <User size={12} />
                          <span>{relatedPost.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{relatedPost.readTime}</span>
                        </div>
                      </div>
                      
                      {/* Read More Button */}
                      <Link
                        to={`/whoisyomama/${relatedPost.id}`}
                        className="inline-flex items-center gap-2 text-green-500 hover:text-green-600 font-medium transition-colors"
                      >
                        Read More
                        <ArrowLeft className="rotate-180" size={16} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogDetailPage;
