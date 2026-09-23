export default function Rating({ product }) {
  const stars = Math.round(product.rating);
  return (
    <span className="rating" aria-label={`${product.rating} out of 5 stars, ${product.reviews} reviews`}>
      {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
      {' '}
      <small>({product.reviews})</small>
    </span>
  );
}
