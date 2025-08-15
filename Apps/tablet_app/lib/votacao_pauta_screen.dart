import 'package:flutter/material.dart';

// Enum para controlar qual opção de voto está selecionada
enum VotoOpcao { sim, nao, abstencao, nenhum }

class VotacaoPautaScreen extends StatefulWidget {
  const VotacaoPautaScreen({super.key});

  @override
  State<VotacaoPautaScreen> createState() => _VotacaoPautaScreenState();
}

class _VotacaoPautaScreenState extends State<VotacaoPautaScreen> {
  // Variável de estado para guardar a opção de voto escolhida
  VotoOpcao _votoSelecionado = VotoOpcao.nenhum;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Barra de topo customizada
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: Chip(
              label: const Text(
                'Em Votação',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
              backgroundColor: const Color(0xFFF08833),
              padding: const EdgeInsets.symmetric(horizontal: 8),
            ),
          ),
        ],
      ),
      // Botão de confirmar fixo na parte inferior
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ElevatedButton(
          onPressed: () {
            if (_votoSelecionado != VotoOpcao.nenhum) {
              Navigator.of(context).pop();
            }
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF2F81F7),
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8.0),
            ),
          ),
          child: const Text(
            'Confirmar Voto',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Denúncia - 2ª votação',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24),
            _buildInfoRow('Autor', 'Mesa Diretora da Câmara'),
            _buildInfoRow(
              'Descrição',
              'Denúncia com pedido de instauração de Comissão Parlamentar de Inquérito',
            ),
            const SizedBox(height: 16),
            Card(
              child: ListTile(
                leading: const Icon(
                  Icons.visibility_outlined,
                  color: Color(0xFF58A6FF),
                ),
                title: const Text(
                  'Visualizar anexo',
                  style: TextStyle(
                    color: Color(0xFF58A6FF),
                    fontWeight: FontWeight.bold,
                  ),
                ),
                onTap: () {},
              ),
            ),
            const SizedBox(height: 32),
            const Text(
              'Escolha seu voto',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),

            // MODIFICAÇÃO: Ícones atualizados para as versões preenchidas
            _buildVotoOption(
              label: 'SIM',
              icon: Icons.check_circle, // Ícone preenchido
              opcao: VotoOpcao.sim,
            ),
            _buildVotoOption(
              label: 'NÃO',
              icon: Icons.cancel, // Ícone preenchido
              opcao: VotoOpcao.nao,
            ),
            _buildVotoOption(
              label: 'ABSTENÇÃO',
              icon: Icons.remove_circle, // Ícone preenchido
              opcao: VotoOpcao.abstencao,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(fontSize: 14, color: Colors.grey[400])),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(fontSize: 16, color: Colors.white),
          ),
        ],
      ),
    );
  }

  Widget _buildVotoOption({
    required String label,
    required IconData icon,
    required VotoOpcao opcao,
  }) {
    final bool isSelected = _votoSelecionado == opcao;

    final Color optionColor;
    switch (opcao) {
      case VotoOpcao.sim:
        optionColor = const Color(0xFF2EA043); // Verde
        break;
      case VotoOpcao.nao:
        optionColor = const Color(0xFFDA3633); // Vermelho
        break;
      case VotoOpcao.abstencao:
        optionColor = const Color(0xFFF08833); // Laranja
        break;
      default:
        optionColor = Colors.grey;
    }

    return Card(
      // ignore: deprecated_member_use
      color: isSelected ? optionColor.withOpacity(0.15) : null,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: isSelected
            ? BorderSide(color: optionColor, width: 2)
            : BorderSide.none,
      ),
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        onTap: () {
          setState(() {
            _votoSelecionado = opcao;
          });
        },
        leading: Icon(
          icon,
          // MODIFICAÇÃO: Cor do ícone agora é permanente, não depende mais da seleção
          color: optionColor,
          size: 28,
        ),
        title: Text(
          label,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: isSelected ? optionColor : Colors.white,
          ),
        ),
      ),
    );
  }
}
