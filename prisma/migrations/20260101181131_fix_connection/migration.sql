-- CreateTable
CREATE TABLE "MatriculaConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nivel" TEXT NOT NULL,
    "grado" TEXT NOT NULL,
    "cantidadSecciones" INTEGER NOT NULL DEFAULT 1,
    "cantidadVarones" INTEGER NOT NULL DEFAULT 0,
    "cantidadHembras" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PersonalConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "nivel" TEXT NOT NULL,
    "cantidadVarones" INTEGER NOT NULL DEFAULT 0,
    "cantidadHembras" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DiasHabiles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Inasistencia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fecha" DATETIME NOT NULL,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "cedula" TEXT,
    "tipoPersona" TEXT NOT NULL,
    "nivel" TEXT NOT NULL,
    "grado" TEXT,
    "seccion" TEXT,
    "genero" TEXT NOT NULL,
    "justificada" BOOLEAN NOT NULL DEFAULT false,
    "observacion" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DiasHabiles_mes_anio_key" ON "DiasHabiles"("mes", "anio");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_username_key" ON "Usuario"("username");
