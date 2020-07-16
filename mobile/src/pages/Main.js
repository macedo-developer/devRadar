import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../service/api';

function Main({ navigation }) {

    const [currentRegion, setCurrentRegion] = useState(null);
    const [devs, setDevs] = useState([]);
    const [techs, setTechs] = useState('');

    useEffect(() => {
        async function loadInitialPosition() {
            const { granted } = await requestPermissionsAsync();

            if (granted) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true
                });

                const { latitude, longitude } = coords;

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                })
            }

        }
        loadInitialPosition();
    }, []);

    async function loadDevs() {

        const { latitude, longitude } = currentRegion;

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs
            }
        });

        setDevs(response.data.devs);
    }

    function handleRegionChange(region) {
        setCurrentRegion(region);
    }

    if (!currentRegion) {
        return null;
    }

    return (
        <>
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled  >
                    <MapView
                        onRegionChangeComplete={handleRegionChange}
                        initialRegion={currentRegion}
                        style={styles.map}>
                        {devs.map(dev => (
                            <Marker
                                key={dev._id}
                                coordinate={{
                                    latitude: dev.location.coordinates[1],
                                    longitude: dev.location.coordinates[0]
                                }}>
                                <Image
                                    style={styles.avatar}
                                    source={{
                                        uri: dev.avatar_url
                                    }} />
                                <Callout onPress={() => {
                                    navigation.navigate('Profile', { github_username: dev.github_username })
                                }}>
                                    <View style={styles.callout}>
                                        <Text style={styles.devName}>{dev.name}</Text>
                                        <Text style={styles.devBio}>{dev.bio}</Text>
                                        <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                                    </View>
                                </Callout>
                            </Marker>
                        ))}
                    </MapView>

                    <View style={styles.searchForm} behavior='padding'>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar por Tecnologias"
                            placeholderTextColor="#999"
                            autoCapitalize="words"
                            autoCorrect={false}
                            value={techs}
                            onChangeText={setTechs}
                        />
                        <TouchableOpacity onPress={(loadDevs)} style={styles.searchButton}>
                            <MaterialIcons name="my-location" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </>
    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#fff'
    },
    callout: {
        width: 260
    },
    devName: {
        fontWeight: 'bold',
        fontSize: 16
    },
    devBio: {
        color: '#666',
        marginTop: 5
    },
    devTechs: {
        marginTop: 5
    },
    searchForm: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row'
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#fff',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4
        },
        elevation: 5
    },
    searchButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8E4Dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15
    }
});

export default Main;