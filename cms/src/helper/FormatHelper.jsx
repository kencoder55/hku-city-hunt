const formatAmount = amount => {
  amount = parseFloat(amount);
  return "$" + amount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const FormatHelper = {
  formatAmount,
};
