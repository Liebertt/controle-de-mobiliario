import { Router } from 'express';
import { Falha } from '../models/Falha.js';
import { upload } from '../middleware/upload.js';
import { uploadBufferToCloudinary } from '../services/cloudinary.js';

const router = Router();

/**
 * GET /falhas?status=Aberta|Resolvida
 * Lista falhas (padrão: somente Abertas), ordenadas por data desc
 */
router.get('/', async (req, res) => {
  try {
    const { status = 'Aberta' } = req.query;
    const falhas = await Falha.find({ status }).sort({ createdAt: -1 });
    res.json(falhas);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao listar falhas' });
  }
});

/**
 * POST /falhas
 * multipart/form-data
 * campos: usuario, matricula, patrimonio (opcional), descricao
 * arquivos: fotos (array com 2 imagens)
 */
router.post(
  '/',
  upload.array('fotos', 2),
  async (req, res) => {
    try {
      const { usuario, matricula, patrimonio = 'Sem patrimônio', descricao } = req.body;

      if (!usuario || !matricula || !descricao) {
        return res.status(400).json({ error: 'Campos obrigatórios: usuario, matricula, descricao' });
      }

      if (!req.files || req.files.length < 2) {
        return res.status(400).json({ error: 'Envie exatamente 2 fotos no campo "fotos"' });
      }

      // checa duplicidade básica (24h)
      const duplicada = await Falha.existeDuplicada({ patrimonio, descricao });
      if (duplicada) {
        return res.status(409).json({
          error: 'Já existe uma falha aberta com o mesmo patrimônio e descrição nas últimas 24h.'
        });
      }

      // Upload das imagens para Cloudinary
      const urls = [];
      for (const file of req.files) {
        const url = await uploadBufferToCloudinary(file.buffer, file.originalname);
        urls.push(url);
      }

      const falha = await Falha.create({
        usuario,
        matricula,
        patrimonio,
        descricao,
        imagens: urls,
        status: 'Aberta'
      });

      res.status(201).json(falha);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Erro ao criar falha' });
    }
  }
);

/**
 * PATCH /falhas/:id/resolver
 * Marca a falha como Resolvida
 */
router.patch('/:id/resolver', async (req, res) => {
  try {
    const { id } = req.params;
    const falha = await Falha.findByIdAndUpdate(
      id,
      { status: 'Resolvida' },
      { new: true }
    );
    if (!falha) return res.status(404).json({ error: 'Falha não encontrada' });
    res.json(falha);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao atualizar falha' });
  }
});

export default router;
