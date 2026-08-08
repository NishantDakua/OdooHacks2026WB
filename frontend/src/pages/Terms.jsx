import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";

const sections = [
  ["Introduction", "These terms describe the frontend rental experience for RentEase. This content is a project placeholder and is not legal advice or legal review."],
  ["Eligibility", "Customers should have the legal capacity to create an account and use the rental service in their jurisdiction."],
  ["Account Registration", "Users are responsible for providing accurate account details and keeping their login credentials secure."],
  ["Rental Products", "Product information, images, pricing, and rental duration are displayed for customer browsing and selection."],
  ["Rental Period", "Rental timeframes are shown at product and checkout stages where available."],
  ["Pricing and Payments", "Prices shown in the frontend reflect the rental selection. Final payment handling may depend on backend integration."],
  ["Security Deposit", "A security deposit may be required depending on the rental flow or product policy, if enabled in the future."],
  ["Product Usage", "Customers must use rented products responsibly and according to the platform rules and product condition."],
  ["Damage/Loss", "Users may be liable for damage, theft, or loss depending on the final rental policy and backend rules."],
  ["Cancellation and Returns", "Cancellation and return rules should follow the customer order policy and any future backend workflow."],
  ["User Responsibilities", "Customers should provide valid information, respect due dates, and keep products in acceptable condition."],
  ["Vendor Responsibilities", "Vendors are expected to maintain product listings, availability, and dispatch/return handling where applicable."],
  ["Privacy", "User information is handled according to the application design and any connected backend policy."],
  ["Limitation of Liability", "RentEase is provided as a frontend project experience and the final legal responsibility depends on the deployed service terms."],
  ["Changes to Terms", "These terms may change over time as the project evolves."],
  ["Contact Information", "For project-related questions, customers can use the Contact page in the frontend."],
];

function Terms() {
  return (
    <AppLayout title="Terms & Conditions" subtitle="Project placeholder terms for the customer experience" cartCount={0}>
      <div className="h-full overflow-y-auto overflow-x-hidden bg-[#f7fbfb] p-7">
        <div className="mx-auto max-w-4xl space-y-4">
          <Card className="p-6">
            <h2 className="text-3xl font-semibold tracking-tight text-black">Terms & Conditions</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              This page is frontend placeholder content for the RentEase project and has not been legally reviewed.
            </p>
          </Card>

          {sections.map(([title, body]) => (
            <Card key={title} className="p-6">
              <h3 className="text-lg font-semibold text-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{body}</p>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

export default Terms;