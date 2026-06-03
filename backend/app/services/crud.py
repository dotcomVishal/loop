from typing import Any, Generic, TypeVar

from fastapi import HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session


ModelT = TypeVar("ModelT")
CreateSchemaT = TypeVar("CreateSchemaT", bound=BaseModel)
UpdateSchemaT = TypeVar("UpdateSchemaT", bound=BaseModel)


class CRUDService(Generic[ModelT, CreateSchemaT, UpdateSchemaT]):
    def __init__(self, model: type[ModelT]):
        self.model = model

    def list(self, db: Session) -> list[ModelT]:
        return db.query(self.model).order_by(self.model.id).all()

    def get(self, db: Session, item_id: int) -> ModelT | None:
        return db.get(self.model, item_id)

    def create(self, db: Session, obj_in: CreateSchemaT) -> ModelT:
        payload = obj_in.model_dump(exclude_unset=True)
        db_obj = self.model(**payload)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, db_obj: ModelT, obj_in: UpdateSchemaT) -> ModelT:
        update_data = obj_in.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(db_obj, field, value)

        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, db_obj: ModelT) -> None:
        db.delete(db_obj)
        db.commit()


class UserService(CRUDService):
    def create(self, db: Session, obj_in: CreateSchemaT) -> Any:
        existing_count = db.query(self.model).count()
        if existing_count >= 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This app is limited to exactly two users.",
            )
        return super().create(db, obj_in)

    def delete(self, db: Session, db_obj: Any) -> None:
        existing_count = db.query(self.model).count()
        if existing_count <= 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The two default users must remain available.",
            )
        super().delete(db, db_obj)
