import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import LoginScreen from './screens/LoginScreen';
import RegisterFaultScreen from './screens/RegisterFaultScreen';
import FaultListScreen from './screens/FaultListScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#007AFF' },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Identificação' }} />
          <Stack.Screen name="RegistrarFalha" component={RegisterFaultScreen} options={{ title: 'Registrar Falha' }} />
          <Stack.Screen name="Falhas" component={FaultListScreen} options={{ title: 'Falhas Abertas' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
