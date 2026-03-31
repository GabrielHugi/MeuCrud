import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import styles from "../styles/styles";
import React, { useEffect, useState } from 'react';
import { getPeopleCrud, createPersonCrud, updatePersonCrud, deletePersonCrud } from "../servers/peopleCrud";

export default function PeopleScreen() {

  const [people, setPeople] = useState([]);

  const [isPersonAddFormVisible, setIsPersonAddFormVisible] = useState(false);
  const [searchTerms, setSearchTerms] = useState('');
  const [isPersonEditFormVisible, setIsPersonEditFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [formId, setFormId] = useState(null);

  useEffect(() => {
    async function loadPeople() {
      try {
        let data;
        if (searchTerms.trim() !== '') {
          data = await getPeopleCrud(searchTerms);
        } else {
          data = await getPeopleCrud();
        }
        setPeople(data);
      } catch (error) {
        console.error(error);
      }
    }
  
    loadPeople();
  }, [searchTerms]);

  useEffect(() => {
    if (people.length > 0 && !people[people.length-1].isAdd) setPeople([...people, {isAdd: true}]);
  }, [people]);

  function addNewPerson() {
    setIsPersonAddFormVisible(true);
  }

  async function savePerson() {
    try {
        await createPersonCrud(formData);
    
        const updated = await getPeopleCrud();
        setPeople(updated);
    
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: ''
          });
        setIsPersonAddFormVisible(false);
    
      } catch (error) {
        console.error("Error saving:", error);
      }
  }


  function editExistingPerson(id) {
    const person = people.find(p => p.id === id);
    
    if (!person) return;

    setFormId(id);
    setFormData({
        firstName: person.firstName,
        lastName: person.lastName,
        email: person.email,
        phone: person.phone
      });
  
    setIsPersonEditFormVisible(true);
  }

  async function editPerson() {
    try {
        const updatedPerson = {
          ...formData
        };
    
        await updatePersonCrud(formId, updatedPerson);
    
        const updated = await getPeopleCrud();
        setPeople(updated);
    
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: ''
          });
        setFormId(null);
        setIsPersonEditFormVisible(false);
    
      } catch (error) {
        console.error("Error updating:", error);
      }
  }

  async function deletePerson() {
    try {
        await deletePersonCrud(formId);
    
        const updated = await getPeopleCrud();
        setPeople(updated);
    
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: ''
          });
        setFormId(null);
        setIsPersonEditFormVisible(false);
    
      } catch (error) {
        console.error("Error deleting:", error);
      }
  }

  console.log(people);

  return (
    <View style={styles.container}>
      <Text style={styles.title} >People</Text>

      <View>
        <Text style={styles.modalTitle}>Search</Text>
        <TextInput
          style={styles.input}
          placeholder="Rafael"
          value={searchTerms}
          onChangeText={setSearchTerms}
        />
      </View>

      <FlatList
        data={people}
        numColumns={1}
        contentContainerStyle={styles.personListContainer}
        keyExtractor={(item, index) =>
            item.isAdd ? "add-button" : item.id.toString()
          }
        renderItem={({ item }) => {
          // se for um add
          if (item.isAdd) {
            return (
              <TouchableOpacity style={styles.addCard} onPress={() => addNewPerson()}>
                <Text style={styles.addText}>＋</Text>
                <Text style={styles.addText}>Add Person</Text>
              </TouchableOpacity>
            );
          }
          // normal
          return (
            <TouchableOpacity style={styles.personCard} onPress={() => {
            editExistingPerson(item.id)}}> 
              <Text style={styles.personName}>{item.firstName}</Text>
              <Text>Full name: {item.firstName} {item.lastName}</Text>
              <Text>Email: {item.email}</Text>
              <Text>Phone: {item.phone}</Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* formulario popup de adicionar */}
      <Modal
        visible={isPersonAddFormVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsPersonAddFormVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Person</Text>

            <TextInput
              style={styles.input}
              placeholder="First name"
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Last name"
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => {setIsPersonAddFormVisible(false); setFormData({firstName: '', lastName: '', email: '', phone: ''});}} ><Text>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={savePerson} ><Text>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isPersonEditFormVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsPersonEditFormVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Person</Text>

            <TextInput
              style={styles.input}
              placeholder="First name"
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Last name"
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => {setIsPersonEditFormVisible(false); setFormData({firstName: '', lastName: '', email: '', phone: ''});}} ><Text>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => editPerson()} ><Text>Save</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => deletePerson()} ><Text>Delete</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
}