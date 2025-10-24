import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Title, Card, HelperText, Paragraph, Menu, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function RegisterFaultScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [patrimonio, setPatrimonio] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagens, setImagens] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  // Patrimônios cadastrados (exemplo, depois virão do banco)
  const patrimonios = ['CHAIR-1001', 'CHAIR-1002', 'CHAIR-1003', 'Sem patrimônio'];

  useEffect(() => {
    const carregarUsuario = async () => {
      const dados = await AsyncStorage.getItem('usuario');
      if (dados) setUsuario(JSON.parse(dados));
    };
    carregarUsuario();
  }, []);

  const escolherImagem = async () => {
    if (imagens.length >= 2) {
      Alert.alert('Limite atingido', 'Você pode adicionar até 2 fotos.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à sua galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImagens([...imagens, result.assets[0].uri]);
    }
  };

  const removerImagem = (uri) => {
    setImagens(imagens.filter((img) => img !== uri));
  };

  const handleSubmit = async () => {
    if (!patrimonio || !descricao || imagens.length < 2) {
      Alert.alert('Erro', 'Preencha todos os campos e adicione 2 fotos.');
      return;
    }

    const novaFalha = {
      usuario: usuario?.nome,
      matricula: usuario?.matricula,
      patrimonio,
      descricao,
      imagens,
      dataHora: new Date().toISOString(),
      status: 'Aberta',
    };

    try {
      // Aqui você fará a requisição POST para o backend (Exemplo com axios)
      // await axios.post('https://seu-servidor.com/falhas', novaFalha);
      console.log('Falha registrada:', novaFalha);

      Alert.alert('Sucesso', 'Falha registrada com sucesso!');
      navigation.replace('Falhas');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível registrar a falha.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Registrar Falha</Title>
          <Paragraph style={styles.subtext}>Preencha as informações abaixo:</Paragraph>

          {/* Seletor de patrimônio */}
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <TextInput
                  label="Patrimônio"
                  value={patrimonio}
                  mode="outlined"
                  editable={false}
                  right={<TextInput.Icon icon="menu-down" />}
                  style={styles.input}
                />
              </TouchableOpacity>
            }
          >
            {patrimonios.map((item, index) => (
              <Menu.Item key={index} onPress={() => { setPatrimonio(item); setMenuVisible(false); }} title={item} />
            ))}
          </Menu>

          <TextInput
            label="Descrição da falha"
            mode="outlined"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            style={styles.input}
          />

          <HelperText type="info">Adicione 2 fotos da cadeira</HelperText>

          <View style={styles.imageContainer}>
            {imagens.map((uri, index) => (
              <TouchableOpacity key={index} onLongPress={() => removerImagem(uri)}>
                <Image source={{ uri }} style={styles.image} />
              </TouchableOpacity>
            ))}
            {imagens.length < 2 && (
              <TouchableOpacity style={styles.addImage} onPress={escolherImagem}>
                <Paragraph style={styles.addText}>+ Foto</Paragraph>
              </TouchableOpacity>
            )}
          </View>

          <Divider style={{ marginVertical: 10 }} />

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            labelStyle={{ fontSize: 16 }}
          >
            Registrar Falha
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F3F6FA',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    color: '#007AFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtext: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 5,
  },
  imageContainer: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  addImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAF1FB',
  },
  addText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
