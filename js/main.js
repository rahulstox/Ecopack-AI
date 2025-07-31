// Main JavaScript for landing page interactions
document.addEventListener("DOMContentLoaded", () => {
  // Smooth scrolling for anchor links
  const links = document.querySelectorAll('a[href^="#"]')
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Add scroll effect to navbar
  const navbar = document.querySelector(".navbar")
  let lastScrollY = window.scrollY

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY

    if (currentScrollY > 100) {
      navbar.style.background = "rgba(255, 255, 255, 0.95)"
      navbar.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
    } else {
      navbar.style.background = "rgba(255, 255, 255, 0.95)"
      navbar.style.boxShadow = "none"
    }

    lastScrollY = currentScrollY
  })

  // Animate stats on scroll
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe value cards
  const valueCards = document.querySelectorAll(".value-card")
  valueCards.forEach((card) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(20px)"
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(card)
  })

  // Add hover effects to CTA buttons
  const ctaButtons = document.querySelectorAll(".btn-primary")
  ctaButtons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)"
    })

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })

  // Demo button functionality
  const demoButton = document.querySelector(".btn-outline")
  if (demoButton) {
    demoButton.addEventListener("click", (e) => {
      e.preventDefault()

      // Create demo modal or redirect to demo
      alert('Demo feature coming soon! Click "Get Started" to try the real recommendation engine.')
    })
  }

  // Add loading animation to hero illustration
  const illustration = document.querySelector(".illustration-svg")
  if (illustration) {
    // Add subtle animation to the AI brain
    const brainElements = illustration.querySelectorAll('circle[cx="200"][cy="100"]')
    brainElements.forEach((element) => {
      element.style.animation = "pulse 3s ease-in-out infinite"
    })
  }

  // Console welcome message
  console.log(`
🌱 Welcome to EcoPack AI!
🤖 AI-powered sustainable packaging recommendations
🌍 Built for Walmart Sparkathon 2025

Ready to transform your packaging strategy?
Visit /recommend to get started!
    `)
})

// Utility functions
function formatNumber(num) {
  return new Intl.NumberFormat().format(num)
}

function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

// Export for use in other scripts
window.EcoPackUtils = {
  formatNumber,
  formatCurrency,
}
