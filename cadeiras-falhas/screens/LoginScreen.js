import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');

  const handleLogin = async () => {
    if (!nome || !matricula) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Salva dados localmente
    await AsyncStorage.setItem('usuario', JSON.stringify({ nome, matricula }));

    // Redireciona para a tela de registro de falha
    navigation.replace('RegistrarFalha');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=1050&q=80' }}
      style={styles.background}
      blurRadius={3}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Registro de Falhas</Title>

            <TextInput
              label="Nome"
              mode="outlined"
              value={nome}
              onChangeText={setNome}
              style={styles.input}
            />

            <TextInput
              label="Matrícula"
              mode="outlined"
              keyboardType="numeric"
              value={matricula}
              onChangeText={setMatricula}
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              labelStyle={{ fontSize: 16 }}
            >
              Entrar
            </Button>
          </Card.Content>
        </Card>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 5,
  },
});
