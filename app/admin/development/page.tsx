import { 
  getAllActiveDevelopment, 
  getDirectorRoleDisplayName,
  getRelatedFeatures 
} from "@/lib/director-features";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: 'Active Development - Admin',
  description: 'Track active tool and feature development',
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    'in-development': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    'active': 'bg-green-500/20 text-green-400 border-green-500/50',
    'planned': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles] || 'bg-gray-500/20 text-gray-400 border-gray-500/50'}`}>
      {status.replace('-', ' ').toUpperCase()}
    </span>
  );
}

export default function DevelopmentPage() {
  const activeDevelopment = getAllActiveDevelopment();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Active Development</h1>
        <p className="text-gray-400">
          Track tools and features currently being developed and used by Director
        </p>
      </div>

      {activeDevelopment.length === 0 ? (
        <div className="border border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-400">No active development items yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeDevelopment.map((item) => {
            const relatedFeatures = getRelatedFeatures(item);
            
            return (
              <div 
                key={item.id} 
                className="border border-gray-700 rounded-lg p-6 bg-gray-900/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={item.status} />
                      <span className="text-sm text-gray-400">
                        {getDirectorRoleDisplayName(item.directorRole)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-300 leading-relaxed">{item.notes}</p>
                </div>

                {item.techStack && item.techStack.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.techStack.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {relatedFeatures.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Related Features</h3>
                    <ul className="space-y-1">
                      {relatedFeatures.map((feature) => (
                        <li key={feature.id} className="text-sm text-gray-300">
                          • {feature.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-500">
                    Last updated: {item.lastUpdated}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



