import mongoose from 'mongoose';

const FalhaSchema = new mongoose.Schema(
  {
    usuario: { type: String, required: true, trim: true },
    matricula: { type: String, required: true, trim: true },
    patrimonio: { type: String, default: 'Sem patrimônio', trim: true },
    descricao: { type: String, required: true, trim: true },
    imagens: { type: [String], validate: v => v.length >= 2 },
    status: { type: String, enum: ['Aberta', 'Resolvida'], default: 'Aberta' }
  },
  { timestamps: true }
);

// índice para buscas rápidas por status/data
FalhaSchema.index({ status: 1, createdAt: -1 });

// “antiduplicidade” básica: mesmo patrimônio + mesma descrição nas últimas 24h
FalhaSchema.statics.existeDuplicada = async function ({ patrimonio, descricao }) {
  const desde = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.findOne({
    patrimonio,
    descricao: { $regex: new RegExp(`^${descricao}$`, 'i') },
    status: 'Aberta',
    createdAt: { $gte: desde }
  });
};

export const Falha = mongoose.model('Falha', FalhaSchema);
