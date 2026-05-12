from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from database.db import Base


class Region(Base):

    __tablename__ = "region"

    id = Column(Integer, primary_key = True)
    nombre = Column(String(200), nullable = False)
    comunas = relationship("Comuna", back_populates = "region")


class Comuna(Base):

    __tablename__ = "comuna"

    id = Column(Integer, primary_key = True)
    nombre = Column(String(200), nullable = False)
    region_id = Column(Integer, ForeignKey("region.id"), nullable = False)
    region = relationship("Region", back_populates = "comunas")
    miembros = relationship("Miembro", back_populates = "comuna")


class Miembro(Base):

    __tablename__ = "miembro"

    id = Column(Integer, primary_key = True)
    nombre = Column(String(255), nullable = False)
    email = Column(String(80), nullable = False)
    telefono = Column(String(15), nullable = True)
    fecha_registro = Column(DateTime, nullable = False)
    comuna_id = Column(Integer, ForeignKey("comuna.id"), nullable = False)
    comuna = relationship("Comuna", back_populates = "miembros")