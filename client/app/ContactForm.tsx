import { motion } from "framer-motion";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { showToast } from "./components/Toast";
import Spinner from "./components/Spinner";

export function ContactForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    serviceRequired: "",
    language: "",
    style: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/v1/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Submission failed');
      }

      showToast('✅ Thank you! We will contact you soon.', 'success');

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        eventType: "",
        serviceRequired: "",
        language: "",
        style: "",
        message: "",
      });

      // Close form after short delay
      setTimeout(() => onClose(), 1500);
    } catch (error: any) {
      console.error(error);
      showToast(error.message || '❌ Submission failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Create Your Custom Song
        </h2>
        <p className="text-gray-600 mb-8">
          Fill out the form below, and we'll be in touch to discuss how we can
          turn your story into a unique musical masterpiece.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name *"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email *"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone Number *"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.phone}
              onChange={handleChange}
            />
            <select
              name="eventType"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.eventType}
              onChange={handleChange}
            >
              <option value="">Select Event Type</option>
              <option value="Wedding Ceremony">
                Wedding Ceremony (Haldi, Sangeet, etc.)
              </option>
              <option value="Corporate Event">Corporate Event</option>
              <option value="Birthday or Anniversary">
                Birthday or Anniversary
              </option>
              <option value="Religious or Cultural">
                Religious or Cultural Event
              </option>
              <option value="Personal Project">Personal Project</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              What Service Do You Require?
            </label>
            <select
              name="serviceRequired"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.serviceRequired}
              onChange={handleChange}
            >
              <option value="">Select a Service</option>
              <option value="Full Song Production">
                Full Song Production (Lyrics, Music, Vocals)
              </option>
              <option value="Lyrics Only">Lyrics Only</option>
              <option value="Instrumental Track">
                Instrumental Track / Score
              </option>
              <option value="Jingle or Anthem">Jingle or Brand Anthem</option>
              <option value="Karaoke Track">Karaoke Version</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <select
              name="language"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="">Preferred Language</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Bhojpuri">Bhojpuri</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Marathi">Marathi</option>
              <option value="Other">Other (Specify in message)</option>
            </select>
            <select
              name="style"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.style}
              onChange={handleChange}
            >
              <option value="">Preferred Musical Style</option>
              <option value="Bollywood">Bollywood</option>
              <option value="Devotional/Bhajan">Devotional/Bhajan</option>
              <option value="Folk">Folk</option>
              <option value="EDM">EDM</option>
              <option value="Lo-fi">Lo-fi</option>
              <option value="Orchestral">Orchestral</option>
              <option value="Other">Other (Specify in message)</option>
            </select>
          </div>

          <textarea
            name="message"
            placeholder="Please provide more details about your event, story, or any specific requirements... *"
            rows={4}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-6"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          <div className="flex justify-end gap-4">
            <motion.button
              type="button"
              onClick={onClose}
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.05 }}
              whileTap={{ scale: submitting ? 1 : 0.95 }}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-semibold transition-all disabled:opacity-50"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.05 }}
              whileTap={{ scale: submitting ? 1 : 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && <Spinner size="sm" />}
              {submitting ? 'Submitting...' : 'Submit Enquiry'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
