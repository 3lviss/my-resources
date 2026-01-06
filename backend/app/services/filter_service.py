from typing import TypeVar, Generic, List, Dict, Any, Optional, Type
from sqlalchemy.orm import Session, Query
from sqlalchemy import desc, asc
from dataclasses import dataclass

T = TypeVar('T')


@dataclass
class PaginatedResult(Generic[T]):
    """Result of a paginated request"""
    items: List[T]
    total: int
    page: int
    per_page: int
    total_pages: int

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "items": self.items,
            "total": self.total,
            "page": self.page,
            "per_page": self.per_page,
            "total_pages": self.total_pages
        }


class FilterService(Generic[T]):
    """
    Generic service for filtering, sorting and paginating SQLAlchemy models.

    Example:
        result = FilterService(db, Resource)\\
            .filter(user_id=user.id)\\
            .sort_by("updated_at", descending=True)\\
            .paginate(page=1, per_page=5)
    """

    def __init__(self, db: Session, model: Type[T]):
        """
        Initialize FilterService

        Args:
            db: SQLAlchemy Session
            model: SQLAlchemy model class
        """
        self.db = db
        self.model = model
        self.query: Query = db.query(model)
        self._filters: Dict[str, Any] = {}
        self._sort_field: Optional[str] = None
        self._sort_descending: bool = True

    def filter(self, **filters) -> 'FilterService[T]':
        """
        Apply filters to the query.

        Args:
            **filters: Dynamic filters as key=value pairs

        Example:
            .filter(user_id=123, type="tool")

        Returns:
            FilterService for method chaining
        """
        for field, value in filters.items():
            if hasattr(self.model, field) and value is not None:
                self.query = self.query.filter(getattr(self.model, field) == value)

        self._filters.update(filters)
        return self

    def search(self, field: str, keyword: str) -> 'FilterService[T]':
        """
        Apply a LIKE search filter on a specific field.

        Args:
            field: Field name to search in
            keyword: Search keyword (case-insensitive)

        Returns:
            FilterService for method chaining

        Example:
            .search("title", "Django")
            .search("description", "tutorial")
        """
        if hasattr(self.model, field):
            self.query = self.query.filter(getattr(self.model, field).ilike(f"%{keyword}%"))
        return self

    def sort_by(self, field: str, descending: bool = True) -> 'FilterService[T]':
        """
        Apply sorting to the query.

        Args:
            field: Field name to sort by
            descending: Sort in descending order (default: True)

        Returns:
            FilterService for method chaining
        """
        if hasattr(self.model, field):
            self._sort_field = field
            self._sort_descending = descending

            if descending:
                self.query = self.query.order_by(desc(getattr(self.model, field)))
            else:
                self.query = self.query.order_by(asc(getattr(self.model, field)))

        return self

    def paginate(self, page: int = 1, per_page: int = 5) -> PaginatedResult[T]:
        """
        Apply pagination and return results.

        Args:
            page: Page number (starts from 1)
            per_page: Number of results per page

        Returns:
            PaginatedResult with items, total count and metadata
        """
        # Validation
        page = max(1, page)
        per_page = max(1, min(per_page, 100))  # Max 100 items per page

        # Count total results
        total = self.query.count()
        total_pages = (total + per_page - 1) // per_page

        # Apply offset and limit
        offset = (page - 1) * per_page
        items = self.query.offset(offset).limit(per_page).all()

        return PaginatedResult(
            items=items,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=total_pages
        )
