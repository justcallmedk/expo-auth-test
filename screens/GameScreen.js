import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import styles from '../App.style.js';
import auth from "../components/auth/Auth";

export default function GameScreen(props) {
  if(props.routes.map[props.routes.index].key !== 'game') {
    return null;
  }

  const [colors, setColors] = useState({});
  const [boxes, setBoxes] = useState([]);
  const [clues, setClues] = useState({});
  const [secret, setSecret] = useState({});

  const MAX_BOXES = 6;
  const MAX16 = 256;

  useEffect(() => {
    console.info('=== use effect colors ===');
    console.info(colors);
    generateBoxes();
  }, [colors]);

  useEffect(() => {
    console.info('=== use effect clues ===');
    console.info(clues);
  }, [clues]);

  useEffect(() => {
    if(Object.keys(secret).length !== 0) {
      return true;
    }
    console.info('=== use effect secret ===');
    setSecret(getSecret());
    console.info(secret);
  }, [secret]);

  useEffect(() => {
    generateColors();
  }, []);

  /* helper functions */
  const getHex = () => {
    const r = Math.floor(Math.random() * MAX16).toString(16).padStart(2,'0');
    const b = Math.floor(Math.random() * MAX16).toString(16).padStart(2,'0');
    const g = Math.floor(Math.random() * MAX16).toString(16).padStart(2,'0');
    return r+g+b;
  }

  let tempDne = {};
  const pickNew = (dne) => {
    for(let i = 0; i < 16; i++) {
      const iHex = i.toString(16);
      if(!dne[iHex] && !tempDne[iHex]) {
        tempDne[iHex] = true;
        return iHex;
      }
    }
    return '0';
  }
  const checkClues = () => {
    console.info('=== check clues ===');
    console.info(clues);
    console.info(colors);
    let colors_ = colors;
    for(let i = 0; i < MAX_BOXES; i++) {
      let new_ = '';
      tempDne = {};
      for(let j = 0; j < colors_[i].split('').length; j++) {
        const c = colors_[i][j];
        if (clues[c] && clues[c]['loc'] && clues[c]['loc'] && clues[c]['loc'][j]) {
          //if the char is in place
          new_ += c;
        }
        else if (clues[c] && clues[c]['loc'] && clues[c]['loc'] && !clues[c]['loc'][j]) {
          //if the char is in wrong place
          //find different misplaced char
          let found = false;
          for(const new_c of Object.keys(clues['exists']) ) {
            if(new_c !== c) {
              new_ += c;
              found = true;
              break;
            }
          }
          if(!found) { // no subsitute found from exists list
            new_ += pickNew(clues['dne']);
          }
        }
        else {
          new_ += pickNew(clues['dne']);
        }
      }
      colors_[i] = new_;
    }
    console.info(secret.raw);
    console.info(colors_);
  }

  const getSecret = () => {
    console.info('=== getting secret clues ===');
    const hex = getHex();
    const secret = hex.split('');
    let secretMap = {
      raw : hex
    };
    for(let i = 0; i < secret.length; i++) {
      if(!secretMap[secret[i]]) {
        secretMap[secret[i]] = {};
      }
      secretMap[secret[i]][i] = true;
      //secretMap[secret[i]] = { i : true };
    }
    console.info(secretMap);
    return secretMap;
  }

  //green - in position, yellow - exists, black - dne
  const onBoxClicked = (i) => {
    console.info('=== on box clicked ===');
    console.info(colors[i] + ' => ' + secret.raw);
    const colorArr = colors[i].split('');
    let result = '';

    let clues_ = clues;
    if(!clues_['dne']) {
      clues_['dne'] = {};
    }
    if(!clues_['exists']) {
      clues_['exists'] = {};
    }

    //compare against secret and create clue
    for(let i = 0; i < colorArr.length; i++) {
      const c = colorArr[i];
      clues_[c] = {
        loc : {}
      }
      if(!secret[c]) {
        result += 'b';
        clues_[c] = false;
        clues_['dne'][c] = true;
        continue;
      }
      if(secret[c] && secret[c][i]) {
        result += 'g';
        clues_[c]['loc'][i] = true;
        clues_['exists'][c] = true;
        continue;
      }
      result += 'y';
      clues_[c]['loc'][i] = false;
      clues_['exists'][c] = true;
    }
    console.info(result);
    //setClues(clues_);

    checkClues();
    generateBoxes();
  }

  const generateColors = () => {
    console.info('=== generating colors===');
    let colors_ = {};
    for(let i = 0; i < MAX_BOXES; i++) {
      const color = getHex();
      colors_[i] = color;
    }
    console.info(colors_);
    setColors(colors_);
  }

  const generateBoxes = () => {
    console.info('=== generating boxes===');
    //console.info(colors);
    let boxes_ = [];
    for(let i = 0; i < MAX_BOXES; i++) {
      boxes_.push(
        <View
          key = {i}
        >
          <Button mode="contained"
                  onPress = { () => {
                    onBoxClicked(i);
                  }}
                  style = {{
                    width: 200,
                    borderWidth: 10,
                    borderColor: '#' + colors[i],
                    backgroundColor: '#000',
                    color: '#fff'
                  }}>
            {colors[i]}
          </Button>
        </View>
      )
    }
    setBoxes(boxes_);
  };

  return (
    <View style={styles.container}>
      { boxes }
    </View>
  );
}
