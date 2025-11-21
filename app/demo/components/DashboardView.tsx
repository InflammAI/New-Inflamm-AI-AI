import { motion } from 'framer-motion';

export function DashboardView() {
  const features = [
    {
      title: "Connect Your Wallet",
      description: "Securely connect your Web3 wallet to access your INFLAMM tokens and health data.",
      icon: "🔐",
    },
    {
      title: "Track Your Health",
      description: "Monitor your daily activity, sleep, and vital signs to earn INFLAMM tokens.",
      icon: "❤️",
    },
    {
      title: "AI Health Assistant",
      description: "Get personalized health insights and recommendations from our AI assistant.",
      icon: "🤖",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl text-white">
        <motion.h1 
          className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to <span className="text-yellow-300">InflammAI</span>
        </motion.h1>
        <motion.p 
          className="mx-auto max-w-2xl text-xl text-yellow-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          The Trustless Healthcare Layer
        </motion.p>
      </div>

      {/* Features */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Started</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={`feature-${index}-${feature.title.replace(/\s+/g, '-').toLowerCase()}`}
              className="bg-white overflow-hidden shadow rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
