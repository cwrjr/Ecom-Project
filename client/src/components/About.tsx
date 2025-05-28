export default function About() {
  const skills = [
    { name: "JavaScript", icon: "fab fa-js-square", color: "text-yellow-500" },
    { name: "React", icon: "fab fa-react", color: "text-blue-500" },
    { name: "Node.js", icon: "fab fa-node-js", color: "text-green-500" },
    { name: "Python", icon: "fab fa-python", color: "text-blue-600" },
    { name: "AWS", icon: "fab fa-aws", color: "text-orange-500" },
    { name: "Git", icon: "fab fa-git-alt", color: "text-red-500" },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">About Me</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-slate-900">
              Passionate Developer with 5+ Years Experience
            </h3>
            <p className="text-lg text-slate-600 leading-relaxed">
              I specialize in creating robust, scalable web applications using modern technologies. 
              My expertise spans front-end frameworks like React and Vue.js, back-end development 
              with Node.js and Python, and cloud deployment strategies.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              I'm passionate about clean code, user experience, and continuous learning. 
              Every project is an opportunity to solve complex problems and create meaningful digital experiences.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-slate-600 font-medium">Projects Completed</div>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-primary mb-2">5+</div>
                <div className="text-slate-600 font-medium">Years Experience</div>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
              {skills.map((skill) => (
                <div key={skill.name} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center hover:shadow-md transition-shadow duration-200">
                  <i className={`${skill.icon} text-3xl ${skill.color} mb-2`}></i>
                  <span className="block text-sm font-medium text-slate-700">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Professional developer portrait" 
              className="rounded-2xl shadow-2xl w-full max-w-md mx-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
