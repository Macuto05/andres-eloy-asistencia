import { MatriculaRepository } from '../../../domain/repositories/MatriculaRepository';
import { Matricula } from '../../../domain/entities/Matricula';

export class SaveMatriculaConfiguration {
    constructor(private repository: MatriculaRepository) { }

    async execute(matriculas: Matricula[]): Promise<void> {
        // Validaciones de negocio
        if (!matriculas || matriculas.length === 0) {
            // Podríamos permitir guardar vacío, pero si se requiere al menos uno, aquí validamos
            // throw new Error("Debe haber al menos un grado registrado");
        }

        // Validar que no haya números negativos
        for (const m of matriculas) {
            if (m.secciones < 0 || m.varones < 0 || m.hembras < 0) {
                throw new Error(`Los valores no pueden ser negativos para el grado ${m.grado}`);
            }
        }

        await this.repository.saveAll(matriculas);
    }
}
