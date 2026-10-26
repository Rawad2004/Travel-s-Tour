import { Pagination } from "react-bootstrap";

export default function Paginador({ page, totalPages, onPageChange, className = "" }) {
  if (!totalPages || totalPages <= 1) return null;

  const items = [];
  const maxVisible = 5;
  let start = Math.max(0, page - Math.floor(maxVisible / 2));
  let end = start + maxVisible;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(0, end - maxVisible);
  }

  items.push(
    <Pagination.Prev
      key="prev"
      disabled={page <= 0}
      onClick={() => onPageChange(page - 1)}
    />
  );

  for (let i = start; i < end; i += 1) {
    items.push(
      <Pagination.Item
        key={i}
        active={i === page}
        onClick={() => onPageChange(i)}
      >
        {i + 1}
      </Pagination.Item>
    );
  }

  items.push(
    <Pagination.Next
      key="next"
      disabled={page >= totalPages - 1}
      onClick={() => onPageChange(page + 1)}
    />
  );

  return (
    <div className={`d-flex justify-content-center mt-4 ${className}`.trim()}>
      <Pagination className="mb-0">{items}</Pagination>
    </div>
  );
}
