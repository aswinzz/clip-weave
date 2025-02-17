import { cn } from "@/lib/utils";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  features: Feature[];
  className?: string;
}

export function FeaturesSection({ features, className }: FeaturesSectionProps) {
  return (
    <div className={cn("py-12", className)}>
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-100 bg-white/80 backdrop-blur-sm hover:shadow-lg hover:shadow-indigo-100/50 transition-all"
            >
              <div className="mb-4 p-3 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
