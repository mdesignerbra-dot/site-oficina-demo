import { useState, useEffect, useRef, useCallback } from 'react';

/* ============================================
   MECÂNICA PRO - COMPONENTE PRINCIPAL
   ============================================
   
   ESTRUTURA DO SITE:
   1. Navbar - Menu de navegação fixo
   2. Hero Section - Banner principal com efeito de digitação
   3. Serviços - Grid de cards com hover effects
   4. Diferenciais - Contadores animados
   5. Depoimentos - Avaliações de clientes
   6. Footer - Rodapé com informações de contato
   7. WhatsApp Button - Botão flutuante
   
   PARA EDITAR: Busque pelos comentários "EDITAR" para encontrar
   as seções de conteúdo facilmente.
   ============================================ */

// ==========================================
// HOOK: Scroll Reveal (Intersection Observer)
// ==========================================
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

// ==========================================
// HOOK: Contador Animado
// ==========================================
function useAnimatedCounter(end: number, duration: number = 2000, startCounting: boolean = false) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!startCounting) return;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Easing cubic
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [end, duration, startCounting]);

  return count;
}

// ==========================================
// HOOK: Efeito de Digitação
// ==========================================
function useTypingEffect(texts: string[], typingSpeed: number = 100, deletingSpeed: number = 50, pauseDuration: number = 2000) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Digitando
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.substring(0, displayText.length + 1));
        } else {
          // Pausa antes de deletar
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        // Deletando
        if (displayText.length > 0) {
          setDisplayText(currentText.substring(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, textIndex, isDeleting, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return displayText;
}

// ==========================================
// COMPONENTE: Navbar
// ==========================================
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* EDITAR: Links do menu de navegação */
  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Diferenciais', href: '#diferenciais' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Contato', href: '#contato' },
  ];

  return (
    <nav className={`navbar fixed top-0 left-0 right-0 z-50 ${scrolled ? 'scrolled' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-2">
            <i className="fas fa-cogs text-[#f97316] text-2xl"></i>
            <span className="text-xl font-bold text-white">
              Mecânica<span className="text-[#f97316]">Pro</span>
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-[#f97316] transition-colors duration-300 text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta bg-[#f97316] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#ea580c]"
            >
              Agendar Agora
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-[fadeIn_0.3s_ease]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-3 text-gray-300 hover:text-[#f97316] transition-colors border-b border-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta mt-4 block text-center bg-[#f97316] text-white px-5 py-2.5 rounded-lg font-semibold text-sm"
            >
              Agendar Agora
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

// ==========================================
// COMPONENTE: Hero Section
// ==========================================
function HeroSection() {
  /* EDITAR: Textos do efeito de digitação */
  const typedTexts = ['Troca de Óleo', 'Freios', 'Suspensão', 'Diagnóstico'];
  const typedResult = useTypingEffect(typedTexts, 100, 60, 2000);

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a]"></div>
      
      {/* Efeitos de glow decorativos */}
      <div className="hero-glow top-20 -left-20"></div>
      <div className="hero-glow bottom-20 -right-20" style={{ animationDelay: '3s' }}></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(249,115,22,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.3) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      {/* Conteúdo */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#f97316]/10 border border-[#f97316]/30 rounded-full px-4 py-2 mb-8 animate-[fadeIn_1s_ease]">
          <span className="w-2 h-2 bg-[#f97316] rounded-full animate-pulse"></span>
          <span className="text-[#f97316] text-sm font-medium">Mais de 10 anos cuidando do seu veículo</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight mb-6 animate-[fadeInUp_1s_ease_0.2s_both]">
          Especialistas em{' '}
          <span className="text-[#f97316] relative">
            {typedResult}
            <span className="typing-cursor">|</span>
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-[fadeInUp_1s_ease_0.4s_both]">
          Manutenção preventiva e corretiva com tecnologia de ponta. 
          Seu veículo em mãos qualificadas, com garantia e transparência.
        </p>

        {/* Botões CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-[fadeInUp_1s_ease_0.6s_both]">
          <a
            href="https://wa.me/5511999999999?text=Olá! Gostaria de agendar um serviço."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta bg-[#f97316] text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 hover:bg-[#ea580c]"
          >
            <i className="fab fa-whatsapp text-2xl"></i>
            Agendar Serviço
          </a>
          <a
            href="#servicos"
            className="btn-cta border-2 border-gray-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 hover:border-[#f97316] hover:text-[#f97316]"
          >
            <i className="fas fa-wrench"></i>
            Nossos Serviços
          </a>
        </div>

        {/* Indicador de scroll */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <i className="fas fa-chevron-down text-[#f97316] text-2xl"></i>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// COMPONENTE: Seção de Serviços
// ==========================================
function ServicesSection() {
  /* EDITAR: Lista de serviços oferecidos */
  const services = [
    {
      icon: 'fa-oil-can',
      title: 'Troca de Óleo',
      description: 'Troca de óleo e filtros com produtos de primeira linha. Lubrificação adequada para máxima performance do motor.',
    },
    {
      icon: 'fa-compact-disc',
      title: 'Freios',
      description: 'Revisão completa do sistema de frenagem. Pastilhas, discos, fluido e regulagem para sua segurança.',
    },
    {
      icon: 'fa-car-side',
      title: 'Suspensão',
      description: 'Diagnóstico e reparo de amortecedores, molas, buchas e barras estabilizadoras. Conforto e estabilidade.',
    },
    {
      icon: 'fa-laptop-code',
      title: 'Diagnóstico Computadorizado',
      description: 'Scanner automotivo de última geração para identificar falhas eletrônicas com precisão.',
    },
    {
      icon: 'fa-car-battery',
      title: 'Sistema Elétrico',
      description: 'Bateria, alternador, motor de partida e toda a parte elétrica do veículo com garantia.',
    },
    {
      icon: 'fa-temperature-high',
      title: 'Ar Condicionado',
      description: 'Higienização, recarga de gás e manutenção completa do sistema de climatização.',
    },
  ];

  return (
    <section id="servicos" className="py-24 px-4 relative">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-[#111111]"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header da seção */}
        <div className="text-center mb-16 reveal">
          <span className="text-[#f97316] font-semibold text-sm uppercase tracking-wider">O que fazemos</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
            Nossos <span className="text-[#f97316]">Serviços</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Oferecemos soluções completas para manutenção do seu veículo, 
            com profissionais qualificados e equipamentos de última geração.
          </p>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className={`service-card reveal-delay-${index + 1} reveal bg-[#1a1a1a] border border-[#333] rounded-2xl p-8 cursor-pointer`}
            >
              {/* Ícone */}
              <div className="card-icon w-16 h-16 bg-[#f97316]/10 rounded-xl flex items-center justify-center mb-6">
                <i className={`fas ${service.icon} text-[#f97316] text-2xl`}></i>
              </div>

              {/* Título */}
              <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
              
              {/* Descrição */}
              <p className="text-gray-400 leading-relaxed">{service.description}</p>

              {/* Link */}
              <div className="mt-6 flex items-center gap-2 text-[#f97316] font-medium text-sm group">
                <span>Saiba mais</span>
                <i className="fas fa-arrow-right transition-transform group-hover:translate-x-2"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// COMPONENTE: Contador Individual
// ==========================================
function CounterItem({ end, suffix, label, icon, startCounting }: {
  end: number;
  suffix: string;
  label: string;
  icon: string;
  startCounting: boolean;
}) {
  const count = useAnimatedCounter(end, 2500, startCounting);

  return (
    <div className="text-center p-6">
      <div className="w-16 h-16 bg-[#f97316]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <i className={`fas ${icon} text-[#f97316] text-xl`}></i>
      </div>
      <div className="counter-value text-4xl sm:text-5xl font-black mb-2">
        +{count}{suffix}
      </div>
      <p className="text-gray-400 font-medium">{label}</p>
    </div>
  );
}

// ==========================================
// COMPONENTE: Seção Diferenciais
// ==========================================
function DifferentialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  /* EDITAR: Dados dos contadores */
  const counters = [
    { end: 10, suffix: '', label: 'Anos de Experiência', icon: 'fa-calendar-check' },
    { end: 5000, suffix: '', label: 'Carros Atendidos', icon: 'fa-car' },
    { end: 98, suffix: '%', label: 'Clientes Satisfeitos', icon: 'fa-star' },
    { end: 15, suffix: '', label: 'Profissionais Qualificados', icon: 'fa-users' },
  ];

  return (
    <section id="diferenciais" ref={sectionRef} className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0f0f0f]"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f97316]/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f97316]/50 to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="text-[#f97316] font-semibold text-sm uppercase tracking-wider">Por que nos escolher</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
            Nossos <span className="text-[#f97316]">Diferenciais</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Números que comprovam nossa dedicação e qualidade no atendimento.
          </p>
        </div>

        {/* Grid de Contadores */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {counters.map((counter, index) => (
            <div key={index} className={`reveal reveal-delay-${index + 1}`}>
              <CounterItem
                end={counter.end}
                suffix={counter.suffix}
                label={counter.label}
                icon={counter.icon}
                startCounting={isVisible}
              />
            </div>
          ))}
        </div>

        {/* Benefícios adicionais */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: 'fa-shield-halved', title: 'Garantia', desc: 'Todos os serviços com garantia de 6 meses' },
            { icon: 'fa-clock', title: 'Pontualidade', desc: 'Entregamos no prazo combinado, sempre' },
            { icon: 'fa-hand-holding-dollar', title: 'Preço Justo', desc: 'Orçamento transparente sem surpresas' },
          ].map((item, index) => (
            <div key={index} className={`reveal reveal-delay-${index + 2} flex items-start gap-4 bg-[#1a1a1a] border border-[#333] rounded-xl p-6`}>
              <div className="w-12 h-12 bg-[#f97316]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className={`fas ${item.icon} text-[#f97316]`}></i>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// COMPONENTE: Seção Depoimentos
// ==========================================
function TestimonialsSection() {
  /* EDITAR: Depoimentos dos clientes */
  const testimonials = [
    {
      name: 'Carlos Silva',
      car: 'Honda Civic 2022',
      rating: 5,
      text: 'Excelente atendimento! Trocaram os freios do meu carro em tempo recorde e com preço justo. Super recomendo!',
      avatar: 'CS',
    },
    {
      name: 'Ana Rodrigues',
      car: 'Toyota Corolla 2021',
      rating: 5,
      text: 'Profissionais muito competentes. Fizeram o diagnóstico completo e explicaram tudo direitinho. Confiança total!',
      avatar: 'AR',
    },
    {
      name: 'Roberto Mendes',
      car: 'VW Tiguan 2023',
      rating: 5,
      text: 'Já sou cliente há 3 anos. Sempre impecáveis no serviço e no atendimento. Melhor mecânica da região!',
      avatar: 'RM',
    },
    {
      name: 'Juliana Costa',
      car: 'Hyundai HB20 2022',
      rating: 5,
      text: 'Levei para revisão antes de uma viagem e saí tranquila. Trabalho sério e honesto. Nota 10!',
      avatar: 'JC',
    },
  ];

  return (
    <section id="depoimentos" className="py-24 px-4 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111111] to-[#0a0a0a]"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="text-[#f97316] font-semibold text-sm uppercase tracking-wider">Depoimentos</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3 mb-4">
            O que nossos <span className="text-[#f97316]">clientes</span> dizem
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            A satisfação dos nossos clientes é o nosso maior orgulho.
          </p>
        </div>

        {/* Grid de Depoimentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`testimonial-card reveal reveal-delay-${index + 1} bg-[#1a1a1a] border border-[#333] rounded-2xl p-8`}
            >
              {/* Estrelas */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <i key={i} className="fas fa-star text-[#f97316] text-sm"></i>
                ))}
              </div>

              {/* Texto */}
              <p className="text-gray-300 leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Info do cliente */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.car}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// COMPONENTE: Footer / Rodapé
// ==========================================
function Footer() {
  return (
    <footer id="contato" className="relative pt-24 pb-8 px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-[#080808]"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f97316]/50 to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* CTA Final */}
        <div className="reveal text-center mb-20 bg-gradient-to-r from-[#f97316]/10 to-[#ea580c]/10 border border-[#f97316]/20 rounded-3xl p-10 sm:p-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Precisa de um serviço?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Entre em contato agora mesmo e agende seu veículo. 
            Atendimento rápido e sem complicação!
          </p>
          <a
            href="https://wa.me/5511999999999?text=Olá! Gostaria de agendar um serviço."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta inline-flex items-center gap-3 bg-[#f97316] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#ea580c]"
          >
            <i className="fab fa-whatsapp text-2xl"></i>
            Falar no WhatsApp
          </a>
        </div>

        {/* Grid de Informações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Sobre */}
          <div className="reveal">
            <div className="flex items-center gap-2 mb-4">
              <i className="fas fa-cogs text-[#f97316] text-xl"></i>
              <span className="text-xl font-bold text-white">
                Mecânica<span className="text-[#f97316]">Pro</span>
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Há mais de 10 anos cuidando do seu veículo com dedicação, 
              transparência e qualidade. Sua segurança é nossa prioridade.
            </p>
          </div>

          {/* Horários */}
          <div className="reveal reveal-delay-1">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <i className="fas fa-clock text-[#f97316]"></i>
              Horário de Funcionamento
            </h4>
            {/* EDITAR: Horários de funcionamento */}
            <ul className="text-gray-400 space-y-2">
              <li className="flex justify-between">
                <span>Segunda a Sexta</span>
                <span className="text-white">08:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sábado</span>
                <span className="text-white">08:00 - 13:00</span>
              </li>
              <li className="flex justify-between">
                <span>Domingo</span>
                <span className="text-red-400">Fechado</span>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="reveal reveal-delay-2">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <i className="fas fa-phone text-[#f97316]"></i>
              Contato
            </h4>
            {/* EDITAR: Informações de contato */}
            <ul className="text-gray-400 space-y-3">
              <li className="flex items-center gap-3">
                <i className="fas fa-phone text-[#f97316] text-sm"></i>
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-envelope text-[#f97316] text-sm"></i>
                <span>contato@mecanicapro.com.br</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fab fa-whatsapp text-[#f97316] text-sm"></i>
                <span>(11) 99999-9999</span>
              </li>
            </ul>
          </div>

          {/* Endereço */}
          <div className="reveal reveal-delay-3">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <i className="fas fa-map-marker-alt text-[#f97316]"></i>
              Endereço
            </h4>
            {/* EDITAR: Endereço */}
            <p className="text-gray-400 leading-relaxed">
              Rua das Mecânicas, 1234<br />
              Bairro Industrial<br />
              São Paulo - SP<br />
              CEP: 01234-567
            </p>
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="reveal flex justify-center gap-4 mb-10">
          {['fa-facebook-f', 'fa-instagram', 'fa-youtube', 'fa-tiktok'].map((icon, index) => (
            <a
              key={index}
              href="#"
              className="w-10 h-10 bg-[#1a1a1a] border border-[#333] rounded-full flex items-center justify-center text-gray-400 hover:text-[#f97316] hover:border-[#f97316] transition-all duration-300"
            >
              <i className={`fab ${icon}`}></i>
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-[#222] pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 MecânicaPro. Todos os direitos reservados. | CNPJ: 00.000.000/0001-00
          </p>
        </div>
      </div>
    </footer>
  );
}

// ==========================================
// COMPONENTE: Botão WhatsApp Flutuante
// ==========================================
function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <a
      href="https://wa.me/5511999999999?text=Olá! Gostaria de informações sobre os serviços."
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#25d366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl"
      aria-label="Contato via WhatsApp"
    >
      <i className="fab fa-whatsapp text-white text-3xl"></i>
    </a>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL: App
// ==========================================
export default function App() {
  // Ativa o scroll reveal em todos os elementos
  useScrollReveal();

  // Re-ativar scroll reveal quando componentes renderizarem
  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );

      const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-['Inter',sans-serif]">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <DifferentialsSection />
      <TestimonialsSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
