import { useState } from 'react';
import { Phone, Mail, Facebook, Instagram, FileText, X } from 'lucide-react';

export function Footer() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  return (
    <>
      <div className="px-8 py-8 border-t-2 border-gray-200/70 bg-white/70 mt-auto backdrop-blur-sm">
        <div className="max-w-[1800px] mx-auto">
          {/* Buttons Section */}
          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={() => setShowFollowModal(true)}
              className="px-8 py-3 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#E56E20', color: 'white' }}
            >
              Follow Us
            </button>
            <button
              onClick={() => setShowContactModal(true)}
              className="px-8 py-3 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#E56E20', color: 'white' }}
            >
              Contact
            </button>
            <button
              onClick={() => setShowRulesModal(true)}
              className="px-8 py-3 rounded-xl font-semibold text-base border-2 transition-all duration-200 hover:scale-105 bg-white"
              style={{ borderColor: '#E56E20', color: '#E56E20' }}
            >
              Rules & Regulations
            </button>
          </div>

          {/* Copyright Section */}
          <p className="text-sm text-center text-gray-600 font-semibold">
            Pass The Paper © 2025
          </p>
          <p className="text-sm text-center text-gray-500 mt-2">
            Academic Resource Marketplace for Verified Students
          </p>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: '#E56E20' }}>
                Contact Us
              </h2>
              <button
                onClick={() => setShowContactModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Contact Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <Mail size={20} style={{ color: '#E56E20' }} />
                    <span className="text-sm text-gray-700">support@passthepaper.com</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <Phone size={20} style={{ color: '#E56E20' }} />
                    <span className="text-sm text-gray-700">+880 1XXX-XXXXXX</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Follow Modal */}
      {showFollowModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: '#E56E20' }}>
                Follow Us
              </h2>
              <button
                onClick={() => setShowFollowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Social Media */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Follow Us</h3>
                <div className="space-y-2">
                  <a
                    href="https://facebook.com/passthepaper"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Facebook size={20} style={{ color: '#E56E20' }} />
                    <span className="text-sm text-gray-700">Facebook</span>
                  </a>
                  <a
                    href="https://instagram.com/passthepaper"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Instagram size={20} style={{ color: '#E56E20' }} />
                    <span className="text-sm text-gray-700">Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rules & Regulations Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: '#E56E20' }}>
                Rules & Regulations
              </h2>
              <button
                onClick={() => setShowRulesModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1. Eligibility</h3>
                <p>• All users must be verified university students with a valid .edu email address.</p>
                <p>• Users must provide accurate student ID information during registration.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">2. Content Guidelines</h3>
                <p>• Uploaded resources must be academically relevant and appropriate.</p>
                <p>• All content must comply with copyright laws and university policies.</p>
                <p>• Plagiarized or fraudulent content is strictly prohibited.</p>
                <p>• Resources must be properly categorized and described.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">3. Upload Approval</h3>
                <p>• All uploaded resources require admin approval before being published.</p>
                <p>• Admins reserve the right to reject or remove any content that violates guidelines.</p>
                <p>• Users will be notified of approval or rejection via the notification system.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">4. Transactions & Wallet</h3>
                <p>• All transactions are final once completed.</p>
                <p>• Wallet funds are non-refundable but can be used for purchases.</p>
                <p>• Withdrawal requests require verification and may take 3-5 business days.</p>
                <p>• Minimum withdrawal amount is 100 points.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">5. Reward Points</h3>
                <p>• Points are awarded for uploading approved resources and platform activities.</p>
                <p>• Points can be exchanged for real money or used for purchases.</p>
                <p>• Fraudulent point accumulation will result in account suspension.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">6. Account Security</h3>
                <p>• Users are responsible for maintaining account confidentiality.</p>
                <p>• Sharing accounts is prohibited and may lead to suspension.</p>
                <p>• Suspicious activities will be investigated and may result in account termination.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">7. Prohibited Activities</h3>
                <p>• Selling or distributing copyrighted material without permission.</p>
                <p>• Creating multiple accounts for fraudulent purposes.</p>
                <p>• Harassment or inappropriate behavior towards other users.</p>
                <p>• Attempting to bypass verification or approval systems.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">8. Privacy & Data</h3>
                <p>• User data is collected and used in accordance with our Privacy Policy.</p>
                <p>• Personal information will not be shared with third parties without consent.</p>
                <p>• Users can request data deletion by contacting support.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">9. Termination</h3>
                <p>• Accounts violating these rules may be suspended or terminated.</p>
                <p>• Repeated violations will result in permanent ban.</p>
                <p>• Users can appeal decisions by contacting support.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">10. Changes to Terms</h3>
                <p>• Pass The Paper reserves the right to modify these rules at any time.</p>
                <p>• Users will be notified of significant changes.</p>
                <p>• Continued use of the platform constitutes acceptance of updated terms.</p>
              </div>

              <div className="pt-4 border-t border-gray-200 mt-4">
                <p className="text-xs text-gray-500 italic">
                  Last Updated: January 24, 2026
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  For questions or concerns, contact us at support@passthepaper.com
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}