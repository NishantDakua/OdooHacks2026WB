import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

const features = [
  "Easy product discovery",
  "Flexible rental duration",
  "Secure checkout",
  "Wishlist",
  "Easy rental management",
];

const journey = ["Browse", "Choose", "Configure", "Rent", "Return"];

function About() {
  return (
    <AppLayout title="About RentEase" subtitle="Rent products without buying them" cartCount={0}>
      <div className="h-full overflow-y-auto overflow-x-hidden bg-[#f7fbfb] p-7">
        <div className="max-w-6xl space-y-6">
          <Card className="p-6 lg:p-8">
            <Badge>Customer Platform</Badge>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black">About RentEase</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">
              RentEase is a platform for renting products and items instead of buying them outright.
              It is designed to help customers discover the items they need, configure them to match
              their use case, rent them for a suitable period, and return them with minimal effort.
            </p>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">
              The goal of the platform is to make rentals feel simple, organized, and trustworthy for
              customers who need flexible access to products for short-term or recurring use.
            </p>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-black">Customer journey</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {journey.map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e9f6f5] text-sm font-bold text-[#4f8c89]">{index + 1}</div>
                    <span className="text-sm font-medium text-black">{step}</span>
                    {index < journey.length - 1 && <span className="hidden text-gray-300 md:inline">→</span>}
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <Card key={feature} className="p-5">
                  <h4 className="text-base font-semibold text-black">{feature}</h4>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {feature === "Easy product discovery" && "Browse curated products with search, filters, and sort controls."}
                    {feature === "Flexible rental duration" && "Choose the rental period that best fits the customer need."}
                    {feature === "Secure checkout" && "Proceed through a structured rental flow with clear order summary details."}
                    {feature === "Wishlist" && "Save items for later and revisit them whenever you return."}
                    {feature === "Easy rental management" && "Track selected products and manage them from the customer experience."}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default About;