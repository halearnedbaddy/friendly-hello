import { useState, useEffect, FormEvent } from 'react';
import { Check, Lock, Zap, Smartphone, ArrowRight, Shield, TrendingUp, Users, Sparkles, ChevronDown, Mail, Phone } from 'lucide-react';
import instagramLogo from '@/assets/instagram-logo.jpg';
import whatsappLogo from '@/assets/whatsapp-logo.jpg';
import facebookLogo from '@/assets/facebook-logo.png';

export function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert(`Welcome! Check your email: ${email}`);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Premium Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/50">
              <Sparkles size={24} className="text-white" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">paying-zee</span>
          </div>
          <div className="hidden md:flex gap-4 items-center">
            <a href="#how" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-400/50 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">How It Works</a>
            <a href="#security" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-400/50 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">Security</a>
            <a href="#contact" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-400/50 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">Contact</a>
          </div>
          <button className="bg-gradient-to-r from-green-400 to-emerald-600 text-black px-6 py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105">
            Get Started
          </button>
        </div>
      </nav>

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full blur-3xl" style={{animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) 2s infinite'}}></div>
      </div>

      {/* Hero Section - Premium */}
      <section className="relative pt-40 pb-32 px-6 min-h-screen flex items-center justify-center">
        <div className="max-w-5xl mx-auto text-center z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">🚀 Join 10,000+ Safe Traders in Kenya</span>
            <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
          </div>

          {/* Main Headline */}
          <h1 className="text-7xl md:text-8xl font-black mb-8 leading-tight">
            <span className="text-white">Buy & Sell </span>
            <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent">Fearlessly</span>
            <br />
            <span className="text-white">on Social Media</span>
          </h1>

          {/* Sub Headline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Your money stays locked in escrow. Releases only when both sides are happy. 
            <span className="text-green-400 font-semibold"> Zero scams. Zero stress.</span>
          </p>

          {/* CTA Buttons - Premium Design */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button className="group relative px-10 py-5 rounded-xl text-lg font-bold overflow-hidden bg-gradient-to-r from-green-400 to-emerald-600 text-black shadow-2xl shadow-green-500/50 hover:shadow-green-500/80 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1">
              <span className="relative flex items-center justify-center gap-3">
                Create Payment Link
                <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>

            <button className="group px-10 py-5 rounded-xl text-lg font-bold border-2 border-green-400/50 text-white hover:border-green-400 hover:bg-green-400/10 transition-all duration-300 backdrop-blur-md transform hover:scale-105 hover:-translate-y-1">
              Watch Demo (90s)
            </button>
          </div>

          {/* Trust Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {[
              { value: '$2.5M+', label: 'In Secure Escrow', icon: '💰' },
              { value: '10K+', label: 'Happy Users', icon: '😊' },
              { value: '99.9%', label: 'Uptime', icon: '⚡' },
              { value: '0', label: 'Scams Reported', icon: '🛡️' },
            ].map((metric, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-green-400/50 transition-all duration-300 group cursor-pointer hover:bg-white/10">
                <p className="text-2xl mb-2">{metric.icon}</p>
                <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">{metric.value}</p>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced */}
      <section id="how" className="relative py-32 px-6 bg-gradient-to-b from-transparent via-white/5 to-transparent scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="text-white">How It </span>
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Complete transaction in 4 simple steps. Zero complications.</p>
          </div>

          {/* Steps with Animation */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              { num: '01', icon: Smartphone, title: 'Share Link', desc: 'Send payment link via WhatsApp, Instagram, or Facebook' },
              { num: '02', icon: Lock, title: 'Money Locked', desc: 'Funds secured instantly in escrow, not with seller' },
              { num: '03', icon: TrendingUp, title: 'Get Proof', desc: 'Seller delivers, you verify tracking & photos' },
              { num: '04', icon: Check, title: 'Release & Get', desc: 'Confirm receipt → money instantly to seller\'s M-Pesa' },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="group">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 p-8 rounded-2xl hover:border-green-400/50 hover:from-white/20 transition-all duration-300 h-full transform hover:scale-105 hover:-translate-y-2">
                    <div className="text-green-400 font-black text-5xl mb-6 opacity-50 group-hover:opacity-100 transition-opacity">{step.num}</div>
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all duration-300">
                      <Icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                  {idx < 3 && (
                    <div className="hidden md:flex absolute -right-3 top-1/3 z-20">
                      <ArrowRight className="text-green-400/30" size={24} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Split Benefits - Premium */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-4">
            <span className="text-white">Built for </span>
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Everyone</span>
          </h2>
          <p className="text-center text-gray-400 text-xl mb-20 max-w-2xl mx-auto">Whether you're buying or selling, we've got your back.</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Buyers */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 p-12 rounded-2xl hover:border-blue-400/50 transition-all duration-300 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/50">
                  <Users size={28} className="text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-8">For Buyers</h3>
                <ul className="space-y-4 mb-8">
                  {[
                    'Money locked until you confirm delivery',
                    'Auto-refund if seller goes dark',
                    '24/7 dispute support team',
                    'Real-time tracking & notifications',
                    'Buy from anyone, anywhere safely'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex gap-4 items-start">
                      <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mt-1 flex-shrink-0 shadow-lg shadow-green-500/50">
                        <Check size={16} className="text-black" />
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full px-6 py-4 bg-gradient-to-r from-blue-400 to-cyan-600 text-black rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105">
                  Start Buying Now →
                </button>
              </div>
            </div>

            {/* Sellers */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 p-12 rounded-2xl hover:border-green-400/50 transition-all duration-300 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/50">
                  <TrendingUp size={28} className="text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-8">For Sellers</h3>
                <ul className="space-y-4 mb-8">
                  {[
                    'Guaranteed payment before shipping',
                    'No chargebacks or payment ghosting',
                    'Instant M-Pesa payouts',
                    'Trusted seller verification badge',
                    'Sell confidently on any platform'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex gap-4 items-start">
                      <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mt-1 flex-shrink-0 shadow-lg shadow-green-500/50">
                        <Check size={16} className="text-black" />
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full px-6 py-4 bg-gradient-to-r from-green-400 to-emerald-600 text-black rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105">
                  Start Selling Now →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security - Premium Section */}
      <section id="security" className="relative py-32 px-6 bg-gradient-to-b from-white/5 to-transparent scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Military-Grade</span>
              <br />
              <span className="text-white">Security</span>
            </h2>
            <p className="text-gray-400 text-xl">Your money, your trust, our responsibility.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              { icon: Shield, title: 'Escrow Protection', desc: 'Funds held by neutral third party until confirmation' },
              { icon: Lock, title: 'End-to-End Encrypted', desc: 'Military-grade encryption on all transactions' },
              { icon: Zap, title: 'Instant Verification', desc: 'Real-time fraud detection powered by AI' },
              { icon: Users, title: 'Trusted Team', desc: '24/7 human support for disputes & issues' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 p-8 rounded-xl hover:border-green-400/50 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all">
                    <Icon size={24} className="text-black" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 backdrop-blur-md border border-green-400/30 rounded-xl p-8 text-center">
            <p className="text-green-300 font-semibold mb-2">🇰🇪 Licensed & Regulated</p>
            <p className="text-gray-300">Compliant with Central Bank of Kenya & all financial regulations</p>
          </div>
        </div>
      </section>

      {/* Real Story */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-16">
            <span className="text-white">See It </span>
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">In Action</span>
          </h2>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-10 overflow-hidden">
            {/* Conversation Bubbles */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">A</div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 max-w-xs">
                  <p className="text-gray-300">"Hey! Interested in these sneakers for KES 14,000?"</p>
                </div>
              </div>

              <div className="flex justify-end items-start gap-4">
                <div className="bg-gradient-to-r from-green-400 to-emerald-600 rounded-lg p-4 max-w-xs text-black font-semibold">
                  <p>"Yeah! Send me the payment link"</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">B</div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">A</div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 max-w-xs">
                  <p className="text-gray-300">paying-zee.com/link/KES14000</p>
                  <p className="text-xs text-gray-500 mt-2">Your money is safe with paying-zee ✓</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-400/20 to-emerald-500/20 border border-green-400/30 rounded-lg p-6 my-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                    <Check size={16} className="text-black" />
                  </div>
                  <span className="text-green-300 font-semibold">Payment Locked in Escrow</span>
                </div>
                <p className="text-gray-300 text-sm">KES 14,000 is secure. Seller hasn't received it yet.</p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">A</div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 max-w-xs">
                  <p className="text-gray-300">"Shipped! Tracking: #KN4839288"</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">B</div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 max-w-xs">
                  <p className="text-gray-300">"Received! They're perfect ✓✓"</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-400/20 to-emerald-500/20 border border-green-400/30 rounded-lg p-6 my-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                    <Check size={16} className="text-black" />
                  </div>
                  <span className="text-green-300 font-semibold">Money Released Instantly</span>
                </div>
                <p className="text-gray-300 text-sm">KES 14,000 + fees sent to seller's M-Pesa in 10 seconds</p>
              </div>

              <div className="text-center mt-8">
                <p className="text-green-300 font-bold text-lg">✓ Deal Complete. Both Happy. No Stress.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Platforms */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-transparent via-white/5 to-transparent">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="text-white">Works </span>
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Everywhere</span>
          </h2>
          <p className="text-gray-400 text-xl mb-16 max-w-2xl mx-auto">No app download. No website needed. Share a link and you're done.</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { logo: instagramLogo, name: 'Instagram', desc: 'Link in bio, secure payments on your DMs' },
              { logo: whatsappLogo, name: 'WhatsApp', desc: 'Copy-paste link directly to buyers' },
              { logo: facebookLogo, name: 'Facebook Marketplace', desc: 'Verified payment badge for more sales' },
            ].map((platform, idx) => (
              <div key={idx} className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 p-10 rounded-2xl hover:border-green-400/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <img src={platform.logo} alt={platform.name} className="w-16 h-16 object-contain mb-4 mx-auto" />
                <h3 className="text-2xl font-bold text-white mb-3">{platform.name}</h3>
                <p className="text-gray-400">{platform.desc}</p>
                <div className="mt-6 text-green-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  Learn more →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Signup */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-white/5 to-transparent">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
            <h3 className="text-4xl font-bold text-white mb-4">Get Early Access</h3>
            <p className="text-gray-400 mb-8">Be first to get exclusive updates, tips & KES 500 bonus credit</p>
            
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-green-400/50 transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-600 text-black rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
              >
                Claim Bonus →
              </button>
            </form>
            
            <p className="text-xs text-gray-500">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* Final CTA - Premium */}
      <section className="relative py-40 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 via-emerald-500/30 to-teal-500/30 blur-3xl opacity-50"></div>
        
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <h2 className="text-6xl md:text-7xl font-black mb-8">
            <span className="text-white">Start </span>
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Safe Trading</span>
            <br />
            <span className="text-white">Today</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12">No credit card. No sign-up hassles. Just pure security.</p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <button className="group relative px-12 py-6 rounded-xl text-lg font-bold overflow-hidden bg-gradient-to-r from-green-400 to-emerald-600 text-black shadow-2xl shadow-green-500/50 hover:shadow-green-500/80 transition-all duration-300 transform hover:scale-110 hover:-translate-y-2">
              <span className="relative flex items-center justify-center gap-3">
                I'm a Buyer
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>

            <button className="group relative px-12 py-6 rounded-xl text-lg font-bold overflow-hidden bg-gradient-to-r from-blue-400 to-cyan-600 text-black shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/80 transition-all duration-300 transform hover:scale-110 hover:-translate-y-2">
              <span className="relative flex items-center justify-center gap-3">
                I'm a Seller
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>
          </div>

          <p className="text-gray-400 text-sm">Ready in 2 minutes • No credit card • Start free</p>
        </div>
      </section>

      {/* Premium Footer */}
      <footer id="contact" className="relative border-t border-white/10 bg-gradient-to-b from-white/5 to-transparent py-20 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/50">
                  <Sparkles size={20} className="text-white" />
                </div>
                <span className="text-xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">paying-zee</span>
              </div>
              <p className="text-gray-400 text-sm">Safe. Fast. Secure escrow for social commerce.</p>
              <p className="text-gray-500 text-xs mt-4">© 2025 Paying-zee. All rights reserved. 🇰🇪</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="text-sm text-gray-400 space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="text-sm text-gray-400 space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status Page</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="text-sm text-gray-400 space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌍</span>
              <p className="text-lg font-semibold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Built with ❤️ for Africa</p>
              <span className="text-gray-500">•</span>
              <p className="text-gray-400 font-medium">Trusted by thousands</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <a href="mailto:support@paying-zee.com" className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-400/50 backdrop-blur-md transition-all duration-300">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all">
                  <Mail size={16} className="text-white" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors font-medium">support@paying-zee.com</span>
              </a>
              <a href="tel:+254701234567" className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-400/50 backdrop-blur-md transition-all duration-300">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all">
                  <Phone size={16} className="text-white" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors font-medium">+254 701 234 567</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
