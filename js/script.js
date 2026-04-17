// ============================================
// ELETRO SEVEN - SCRIPT PRINCIPAL
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // ANIMAÇÕES E CONTADORES
    // ============================================
    
    // Contadores das estatísticas
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current) + (target === 100 ? '%' : '');
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + (target === 100 ? '%' : '');
                }
            };
            
            updateCounter();
        });
    }
    
    // Executa contadores quando entrar na seção
    const observerStats = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observerStats.unobserve(entry.target);
            }
        });
    });
    
    document.querySelector('.stats').addEventListener('mouseenter', animateCounters);
    
    // ============================================
    // SIMULAÇÃO DE ORÇAMENTO
    // ============================================
    
    const simulacaoForm = document.getElementById('simulacaoForm');
    const valorTotalEl = document.getElementById('valorTotal');
    const tipoServico = document.getElementById('tipoServico');
    const area = document.getElementById('area');
    const urgencia = document.getElementById('urgencia');
    const finsemana = document.getElementById('finsemana');
    const noite = document.getElementById('noite');
    
    function calcularOrcamento() {
        let valorBase = parseFloat(tipoServico.value) || 0;
        const areaValue = parseFloat(area.value) || 0;
        const urgenciaValue = parseFloat(urgencia.value) || 1;
        
        // Cálculo por área (adicional por m²)
        const valorArea = areaValue * 2; // R$2 por m²
        
        // Adicionais
        let adicionais = 0;
        if (finsemana.checked) adicionais += parseFloat(finsemana.value);
        if (noite.checked) adicionais += parseFloat(noite.value);
        
        // Total
        const total = (valorBase + valorArea + adicionais) * urgenciaValue;
        
        // Formatação
        const totalFormatado = total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        
        valorTotalEl.textContent = totalFormatado;
        valorTotalEl.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            valorTotalEl.style.transform = 'scale(1)';
        }, 200);
        
        return total;
    }
    
    // Listeners para cálculo em tempo real
    tipoServico.addEventListener('change', calcularOrcamento);
    area.addEventListener('input', calcularOrcamento);
    urgencia.addEventListener('change', calcularOrcamento);
    finsemana.addEventListener('change', calcularOrcamento);
    noite.addEventListener('change', calcularOrcamento);
    
    // Submit do formulário
    simulacaoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const total = calcularOrcamento();
        const servicoSelecionado = tipoServico.options[tipoServico.selectedIndex].dataset.name;
        
        if (total === 0) {
            alert('Por favor, selecione um serviço e preencha os dados!');
            return;
        }
        
        // Mensagem personalizada para WhatsApp
        const mensagem = `Olá! Gostaria de um orçamento para:\n\n` +
                       `📋 Serviço: ${servicoSelecionado}\n` +
                       `📏 Área: ${area.value || 0}m²\n` +
                       `⚡ Urgência: ${urgencia.options[urgencia.selectedIndex].text}\n` +
                       `💰 Valor estimado: ${valorTotalEl.textContent}\n\n` +
                       `Pode agendar para mim? 😊`;
        
        const whatsappUrl = `https://wa.me/5516981027619?text=${encodeURIComponent(mensagem)}`;
        window.open(whatsappUrl, '_blank');
        
        // Efeito de sucesso
        valorTotalEl.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            valorTotalEl.classList.remove('animate__animated', 'animate__pulse');
        }, 1000);
    });
    
    // ============================================
    // EFEITOS VISUAIS E INTERATIVOS
    // ============================================
    
    // Animação do header ao scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.2)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        }
    });
    
    // Animações de scroll para cards
    const observerCards = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.service-card, .diferencial-card, .stat-card').forEach(card => {
        observerCards.observe(card);
    });
    
    // ============================================
    // EFEITOS HOVER NOS CARDS
    // ============================================
    
    document.querySelectorAll('.service-card, .diferencial-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        });
    });
    
    // ============================================
    // WHATSAPP FLOATING BUTTON
    // ============================================
    
    const whatsappFloat = document.querySelector('.whatsapp-float');
    let isVisible = true;
    
    whatsappFloat.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(0) rotate(360deg)';
        this.querySelector('span').style.opacity = '1';
        this.querySelector('span').style.transform = 'translateX(0)';
    });
    
    whatsappFloat.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0) rotate(0deg)';
        this.querySelector('span').style.opacity = '0';
        this.querySelector('span').style.transform = 'translateX(-100%)';
    });
    
    // Scroll suave para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ============================================
    // EFEITOS PARTICULAS NO HERO (OPCIONAL)
    // ============================================
    
    function createParticles() {
        const hero = document.querySelector('.hero');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            hero.appendChild(particle);
        }
    }
    
    // createParticles(); // Descomente para ativar partículas
    
    // ============================================
    // LOADING INICIAL
    // ============================================
    
    document.body.classList.add('loaded');
    
    console.log('🚀 Eletro Seven - Site carregado com sucesso!');
    console.log('📱 WhatsApp: (16) 98102-7619');
});