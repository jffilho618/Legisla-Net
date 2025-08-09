import 'package:flutter/material.dart';
import 'votacao_pauta_screen.dart'; // Importação Relativa da nova tela

enum VotoTipo { sim, nao, abstencao, naoVotado }

class DashboardVereadorScreen extends StatefulWidget {
  const DashboardVereadorScreen({super.key});

  @override
  State<DashboardVereadorScreen> createState() =>
      _DashboardVereadorScreenState();
}

class _DashboardVereadorScreenState extends State<DashboardVereadorScreen> {
  bool _showFinalizadas = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(),
            const SizedBox(height: 24),
            _buildToggleButtons(),
            const SizedBox(height: 24),
            if (_showFinalizadas)
              _buildFinalizadasView()
            else
              _buildEmAndamentoView(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(16.0),
      margin: const EdgeInsets.symmetric(horizontal: 16.0),
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color, // Cor do card vinda do tema
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          const CircleAvatar(
            radius: 35, // Tamanho ajustado
            backgroundImage: NetworkImage('https://i.imgur.com/5h25c3G.png'),
          ), //
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Boa tarde Vereador,',
                  style: TextStyle(fontSize: 16, color: Colors.white70),
                ),
                const Text(
                  'DE ASSIS DANTAS',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ), //
                const SizedBox(height: 4),
                const Text(
                  'Câmara municipal de Dom Expedito Lopes, 08 de agosto de 2025',
                  style: TextStyle(fontSize: 12, color: Colors.white60),
                ), //
              ],
            ),
          ),
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.exit_to_app, color: Color(0xFFF08833)), //
          ),
        ],
      ),
    );
  }

  Widget _buildToggleButtons() {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardTheme.color, // Cor do tema
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildToggleButton('Em Andamento', !_showFinalizadas), //
          _buildToggleButton('Finalizada', _showFinalizadas), //
        ],
      ),
    );
  }

  Widget _buildToggleButton(String text, bool isSelected) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _showFinalizadas = text == 'Finalizada';
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 48, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF2F81F7) : Colors.transparent, //
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          text,
          style: TextStyle(
            color: Colors.white,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }

  // Adicionado card "Não votado" com navegação
  Widget _buildEmAndamentoView() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        children: [
          // Card para pauta não votada
          GestureDetector(
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => const VotacaoPautaScreen(),
                ),
              );
            },
            child: const _VotacaoCard(
              tema: 'Projeto de Lei 101/2025 - 1ª votação',
              meuVoto: VotoTipo.naoVotado,
              status: 'Em Andamento',
              statusColor: Color(0xFF2EA043),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFinalizadasView() {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Padding(
              padding: EdgeInsets.only(left: 8.0, bottom: 16.0),
              child: Text(
                'Votações Finalizadas',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ), //
            ),
            Expanded(
              child: ListView(
                children: const [
                  _VotacaoCard(
                    tema: 'Denúncia - 2ª votação', //
                    meuVoto: VotoTipo.sim,
                    status:
                        'Aprovado - 6 votos Sim - 0 votos Não - 0 abstenções', //
                    statusColor: Color(0xFF2EA043),
                  ),
                  _VotacaoCard(
                    tema: 'Denúncia - 1ª votação', //
                    meuVoto: VotoTipo.nao,
                    status:
                        'Aprovado - 7 votos Sim - 0 votos Não - 0 abstenções', //
                    statusColor: Color(0xFF2EA043),
                  ),
                  _VotacaoCard(
                    tema: 'PROJETO DE LEI 030/2025 - 2ª votação', //
                    meuVoto: VotoTipo.naoVotado,
                    status:
                        'Reprovado - 0 votos Sim - 0 votos Não - 0 abstenções', //
                    statusColor: Color(0xFFDA3633),
                  ),
                  _VotacaoCard(
                    tema: 'PROJETO DE LEI 030/2025 - 1ª votação',
                    meuVoto: VotoTipo.abstencao,
                    status:
                        'Aprovado - 9 votos Sim - 0 votos Não - 0 abstenções',
                    statusColor: Color(0xFF2EA043),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _VotacaoCard extends StatelessWidget {
  final String tema;
  final VotoTipo meuVoto;
  final String status;
  final Color statusColor;

  const _VotacaoCard({
    required this.tema,
    required this.meuVoto,
    required this.status,
    required this.statusColor,
  });

  Map<String, dynamic> _getVotoStyle() {
    switch (meuVoto) {
      case VotoTipo.sim:
        return {'text': 'sim', 'color': const Color(0xFF2EA043)}; //
      case VotoTipo.nao:
        return {'text': 'não', 'color': const Color(0xFFDA3633)};
      case VotoTipo.abstencao:
        return {'text': 'abstenção', 'color': const Color(0xFFF08833)};
      case VotoTipo.naoVotado:
        return {'text': 'Não votado', 'color': Colors.grey[700]!}; //
    }
  }

  @override
  Widget build(BuildContext context) {
    final votoStyle = _getVotoStyle();
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Tema: $tema',
              style: const TextStyle(
                fontSize: 16,
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Text(
                      'Meu voto: ',
                      style: TextStyle(fontSize: 14, color: Colors.white70),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: votoStyle['color'],
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        votoStyle['text'],
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                Text(
                  status,
                  style: TextStyle(
                    color: statusColor,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
