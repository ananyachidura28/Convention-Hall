/**
 * Interactive Event Cost Calculator & Budget Planner
 */

document.addEventListener('DOMContentLoaded', () => {
  initBudgetCalculator();
});

function initBudgetCalculator() {
  const calcForm = document.getElementById('budget-calc-form');
  if (!calcForm) return;

  // Grab UI Inputs
  const inputGuests = document.getElementById('calc-guests');
  const valueGuests = document.getElementById('calc-guests-value');
  const selectCategory = document.getElementById('calc-category');
  const selectTier = document.getElementById('calc-tier');
  const inputBudget = document.getElementById('calc-budget');
  const valueBudget = document.getElementById('calc-budget-value');
  const serviceCheckboxes = document.querySelectorAll('.calc-service-checkbox');

  // Grab UI Output Elements
  const outBaseCost = document.getElementById('out-base-cost');
  const outServicesCost = document.getElementById('out-services-cost');
  const outTotalCost = document.getElementById('out-total-cost');
  const outStatusMsg = document.getElementById('out-status-message');
  const budgetProgress = document.getElementById('budget-progress-bar');
  const budgetPercentage = document.getElementById('budget-percentage');

  // Sync Slider values in UI
  if (inputGuests && valueGuests) {
    inputGuests.addEventListener('input', () => {
      valueGuests.textContent = inputGuests.value;
      calculateBudget();
    });
  }

  if (inputBudget && valueBudget) {
    inputBudget.addEventListener('input', () => {
      // Format number to currency view
      valueBudget.textContent = '₹' + parseInt(inputBudget.value).toLocaleString('en-IN');
      calculateBudget();
    });
  }

  // Bind change events
  [selectCategory, selectTier, inputBudget, inputGuests].forEach(input => {
    if (input) {
      input.addEventListener('change', calculateBudget);
      input.addEventListener('input', calculateBudget);
    }
  });

  serviceCheckboxes.forEach(cb => {
    cb.addEventListener('change', calculateBudget);
  });

  // Run initial calculation
  calculateBudget();

  function calculateBudget() {
    if (!outBaseCost || !outServicesCost || !outTotalCost) return;

    const guests = parseInt(inputGuests.value) || 100;
    const category = selectCategory.value;
    const tier = selectTier.value;
    const budgetLimit = parseInt(inputBudget.value) || 100000;

    // 1. Calculate base hall price based on Tier and Category multiplier
    let baseTierCost = 50000; // Standard tier baseline
    if (tier === 'premium') baseTierCost = 90000;
    if (tier === 'luxury') baseTierCost = 150000;

    // Event category multiplier (fallback to 1 if not found)
    const factor = EVENT_CATEGORIES[category] ? EVENT_CATEGORIES[category].baseFactor : 1.0;
    const baseHallCost = Math.round(baseTierCost * factor);

    // 2. Additional Services Cost
    let servicesCost = 0;
    serviceCheckboxes.forEach(cb => {
      if (cb.checked) {
        const serviceKey = cb.value;
        const serviceData = ADDITIONAL_SERVICES[serviceKey];
        if (serviceData) {
          if (serviceData.unit === 'guest') {
            servicesCost += serviceData.price * guests;
          } else {
            servicesCost += serviceData.price;
          }
        }
      }
    });

    const totalCost = baseHallCost + servicesCost;

    // 3. Render Outputs in INR Locale
    outBaseCost.textContent = '₹' + baseHallCost.toLocaleString('en-IN');
    outServicesCost.textContent = '₹' + servicesCost.toLocaleString('en-IN');
    outTotalCost.textContent = '₹' + totalCost.toLocaleString('en-IN');

    // 4. Budget progress calculations
    const percent = Math.min(Math.round((totalCost / budgetLimit) * 100), 100);
    budgetProgress.style.width = percent + '%';
    budgetPercentage.textContent = percent + '%';

    // Reset progress colors
    budgetProgress.className = 'progress-bar-fill';

    if (totalCost > budgetLimit) {
      budgetProgress.classList.add('bg-danger');
      outStatusMsg.innerHTML = `<span style="color: var(--error); font-weight:700;">⚠️ Exceeds Budget!</span> Your estimated cost is <b>₹${(totalCost - budgetLimit).toLocaleString('en-IN')}</b> over budget. Try adjusting guest counts, changing tiers, or deselected some services.`;
    } else {
      budgetProgress.classList.add('bg-success');
      const savings = budgetLimit - totalCost;
      outStatusMsg.innerHTML = `<span style="color: var(--success); font-weight:700;">✅ Under Budget!</span> You are saving <b>₹${savings.toLocaleString('en-IN')}</b> within your budget limit. Ready to book!`;
    }
  }
}
