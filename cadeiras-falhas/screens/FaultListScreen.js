import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FaultListScreen({ navigation }) {
  const [falhas, setFalhas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Simulação inicial — depois puxaremos do MongoDB
  const falhasExemplo = [
    {
      id: '1',
      patrimonio: 'CHAIR-1002',
      descricao: 'Encosto solto',
      dataHora: '2025-10-24T13:10:00',
      status: 'Aberta',
    },
    {
      id: '2',
      patrimonio: 'CHAIR-1003',
      descricao: 'Rodízio quebrado',
      dataHora: '2025-10-24T12:50:00',
      status: 'Aberta',
    },
  ];

  useEffect(() => {
    carregarFalhas();
  }, []);

  const carregarFalhas = async () => {
    setRefreshing(true);
    // Aqui futuramente faremos a requisição com axios
    // const resposta = await axios.get('https://seu-servidor.com/falhas');
    await new Promise((resolve) => setTimeout(resolve, 1000)); // simula carregamento
    setFalhas(falhasExemplo);
    setRefreshing(false);
  };

  const renderFalha = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.rowBetween}>
          <Title style={styles.title}>{item.patrimonio}</Title>
          <Chip style={styles.chip} textStyle={{ color: 'white' }}>
            {item.status}
          </Chip>
        </View>

        <Paragraph style={styles.desc}>{item.descricao}</Paragraph>
        <Paragraph style={styles.date}>
          {new Date(item.dataHora).toLocaleString('pt-BR')}
        </Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.pageTitle}>Falhas Recentes</Title>

      <FlatList
        data={falhas}
        keyExtractor={(item) => item.id}
        renderItem={renderFalha}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={carregarFalhas} />
        }
        ListEmptyComponent={
          <Paragraph style={styles.emptyText}>
            Nenhuma falha aberta no momento.
          </Paragraph>
        }
      />

      <Button
        mode="contained"
        onPress={() => navigation.replace('RegistrarFalha')}
        style={styles.newButton}
        labelStyle={{ fontSize: 16 }}
      >
        Nova Falha
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FA',
    padding: 16,
  },
  pageTitle: {
    textAlign: 'center',
    fontSize: 22,
    color: '#007AFF',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 16,
    elevation: 3,
    paddingVertical: 4,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    color: '#333',
  },
  chip: {
    backgroundColor: '#007AFF',
  },
  desc: {
    color: '#555',
    marginTop: 6,
  },
  date: {
    color: '#777',
    fontSize: 13,
    marginTop: 6,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#777',
  },
  newButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 5,
    marginTop: 10,
  },
});
