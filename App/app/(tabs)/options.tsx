import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function OptionsScreen() {

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerText}>Options</Text>
        </View>
      </View>
      
      <View style={styles.fixedDetails}>
        <TouchableOpacity style={[styles.selectorOptions, { width: '100%' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.selectorOptionsText}>Informations personnelles</Text>
                <Ionicons name="chevron-forward-outline" size={18} color="black" />
            </View>
        </TouchableOpacity>
        <View style={styles.separatorDetails}/>
        <TouchableOpacity style={[styles.selectorOptions, { width: '100%' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.selectorOptionsText}>Sécurité du compte</Text>
                <Ionicons name="chevron-forward-outline" size={18} color="black" />
            </View>
        </TouchableOpacity>
        <View style={styles.separatorDetails}/>
        <TouchableOpacity style={[styles.selectorOptions, { width: '100%' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.selectorOptionsText}>Notifications</Text>
                <Ionicons name="chevron-forward-outline" size={18} color="black" />
            </View>
        </TouchableOpacity>
        <View style={styles.separatorDetails}/>
        <TouchableOpacity style={[styles.selectorOptions, { width: '100%' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.selectorOptionsText}>Devenir botaniste</Text>
                <Ionicons name="chevron-forward-outline" size={18} color="black" />
            </View>
        </TouchableOpacity>
        <View style={styles.separatorDetails}/>
        <TouchableOpacity style={[styles.selectorOptions, { width: '100%' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.selectorOptionsText}>Questions</Text>
                <Ionicons name="chevron-forward-outline" size={18} color="black" />
            </View>
        </TouchableOpacity>
        <View style={styles.separatorDetails}/>
        <TouchableOpacity style={[styles.selectorOptions, { width: '100%' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.selectorOptionsText}>Mes données</Text>
                <Ionicons name="chevron-forward-outline" size={18} color="black" />
            </View>
        </TouchableOpacity>
        <View style={styles.separatorDetails}/>
        <TouchableOpacity style={[styles.selectorOptions, { width: '100%' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.selectorOptionsText}>Informations légales</Text>
                <Ionicons name="chevron-forward-outline" size={18} color="black" />
            </View>
        </TouchableOpacity>
        <View style={styles.separatorDetails}/>
      </View>
      <View style={styles.fixedDetailsBtn}>
        <View style={styles.selectorContainer}>
            <TouchableOpacity style={styles.selectorButton}>
                <Text style={{color : '#FFF', fontSize : 14, fontWeight: 'bold',}}>Se déconnecter</Text>
            </TouchableOpacity>
        </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF', 
  },
  header: {
    height: 100,
    backgroundColor: '#668F80',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 50,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  fixedDetails: {
    marginTop: 30,
    alignItems: 'flex-start',
  },
  fixedDetailsBtn: {
    paddingTop : 100,
    marginTop: 100,
    alignItems: 'center',
  },
  scrollViewContent: {
    paddingTop: 20, 
  },
  body: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
  },
  selectorContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 25,
    overflow: 'hidden',
    width: '90%', 
    alignItems: 'center',
  },
  separatorDetails: {
    height: 1,
    backgroundColor: '#E8E8E8',
    width: '95%',
    marginVertical: 5,
    alignSelf : 'center',
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#668F80',
  },
  selectorOptions: {
    padding : 10,
    color : '#BDBDBD',
  },
  selectorOptionsText: {
    fontSize : 14,
  }
});
