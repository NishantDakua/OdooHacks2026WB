import { useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Input from "../components/ui/Input";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setSuccess("Thanks for reaching out. Your message has been submitted in the frontend demo state.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const infoCards = [
    ["Email", "support@rentease.com"],
    ["Phone", "+1 (555) 123-4567"],
    ["Support Hours", "Mon - Fri, 9:00 AM - 6:00 PM"],
  ];

  return (
    <AppLayout title="Contact Us" subtitle="Reach the RentEase team" cartCount={0}>
      <div className="h-full overflow-y-auto overflow-x-hidden bg-[#f7fbfb] p-7">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <Card className="p-6">
              <Badge>Customer Support</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black">Contact Us</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Use the form below to send a message to the RentEase team. This page is currently frontend-only,
                so submission shows a success state in the demo experience instead of sending a real email.
              </p>
            </Card>

            <div className="grid gap-4 lg:grid-cols-1 ">
              {infoCards.map(([label, value]) => (
                <Card key={label} className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
                  <p className="mt-2 text-sm font-semibold text-black">{value}</p>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-black">Send a message</h3>

            {error && (
              <div className="mt-4 rounded-xl border border-red-500 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 rounded-xl border border-[#4f8c89] bg-[#e9f6f5] p-3 text-sm text-[#376c69]">
                {success}
              </div>
            )}

            <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="mb-2 block text-sm font-semibold text-black">Name</label>
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black">Email</label>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your email" required />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black">Subject</label>
                <Input name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  required
                  placeholder="Write your message"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-gray-400 focus:border-[#4f8c89] focus:ring-2 focus:ring-[#4f8c89]/10"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#4f8c89] py-3 text-sm font-semibold text-white transition hover:bg-[#376c69]"
              >
                Submit
              </button>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

export default Contact;