import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { 
  getAllDirectorRoles, 
  getFeaturesByRole, 
  getDirectorRoleDisplayName 
} from "@/lib/director-features";

export const metadata = {
  title: 'Features - Director',
  description: 'Director capabilities organized by role - Executive, Finance, Development, Ops, Communications, and Program Directors',
}

export default function FeaturesPage() {
  const directorRoles = getAllDirectorRoles();

  return (
    <div className="bg-black text-white min-h-screen">
      <SiteHeader />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 via-black to-black">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Director Features
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              AI-native capabilities organized by director role
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Each director provides specialized capabilities to help your organization operate efficiently and scale impact.
            </p>
          </div>
        </div>
      </section>

      {/* Features by Director Role */}
      <section className="py-20 bg-black">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {directorRoles.map((role) => {
                const features = getFeaturesByRole(role);
                const displayName = getDirectorRoleDisplayName(role);
                
                return (
                  <div 
                    key={role} 
                    className="border border-gray-800 rounded-lg p-6 bg-gray-900/50 hover:bg-gray-900 transition-colors"
                  >
                    <h2 className="text-2xl font-bold mb-4 text-white">
                      {displayName}
                    </h2>
                    <div className="space-y-4">
                      {features.map((feature) => (
                        <div key={feature.id} className="border-l-2 border-gray-700 pl-4">
                          <h3 className="text-lg font-semibold mb-2 text-white">
                            {feature.title}
                          </h3>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Learn how Director can help your organization scale with AI-native leadership capacity.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:bosko@directorforgood.org"
              className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-4 rounded-lg transition-colors inline-block"
            >
              Contact Us
            </a>
            <a
              href="/"
              className="border border-gray-600 text-white hover:bg-gray-800 font-semibold px-8 py-4 rounded-lg transition-colors inline-block"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}



