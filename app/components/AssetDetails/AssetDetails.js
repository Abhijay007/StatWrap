import React, { useEffect, useState } from 'react';
import { withStyles } from '@mui/styles';
import Accordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssetAttributes from '../AssetAttributes/AssetAttributes';
import NoteEditor from '../NoteEditor/NoteEditor';
import Loading from '../Loading/Loading';
import SourceControlHistory from '../SourceControlHistory/SourceControlHistory';
import styles from './AssetDetails.css';

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 32,
    '&$expanded': {
      minHeight: 32
    }
  },
  content: {
    '&$expanded': {
      margin: '6px 0'
    }
  },
  expanded: {}
})(MuiAccordionSummary);

const assetDetails = props => {
  const {
    asset,
    onAddedNote,
    onUpdatedNote,
    onDeletedNote,
    onUpdatedAttribute,
    assetAttributes,
    sourceControlEnabled,
    dynamicDetails
  } = props;

  const [expandNotes, setExpandNotes] = useState(false);
  const [notesLabel, setNotesLabel] = useState('Notes (0)');

  useEffect(() => {
    if (asset && asset.notes) {
      setNotesLabel(`Notes (${asset.notes.length})`);
      setExpandNotes(asset.notes.length > 0);
    } else {
      setNotesLabel(`Notes (0)`);
      setExpandNotes(false);
    }
  }, [asset]);

  const clickNotesAccordionHandler = () => {
    setExpandNotes(prevState => !prevState);
  };

  const updatedNoteHandler = (note, text) => {
    if (note) {
      if (onUpdatedNote) {
        onUpdatedNote(asset, text, note);
      }
    } else if (onAddedNote) {
      onAddedNote(asset, text);
    }
  };

  const deleteNoteHandler = note => {
    if (onDeletedNote) {
      onDeletedNote(asset, note);
    }
  };

  const updateAssetAttribute = (name, value) => {
    if (onUpdatedAttribute) {
      onUpdatedAttribute(asset, name, value);
    }
  };

  let sourceControlAccordion = null;
  if (sourceControlEnabled) {
    let dynamicDetailsContainer = <Loading>Please wait while file history loads...</Loading>;
    if (dynamicDetails) {
      dynamicDetailsContainer = <SourceControlHistory history={dynamicDetails.sourceControl} />;
    }
    sourceControlAccordion = (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="source-control-content"
          id="source-control-header"
          className={styles.heading}
        >
          <Typography className={styles.headingTitle}>Source Control</Typography>
        </AccordionSummary>
        <AccordionDetails className={styles.details}>{dynamicDetailsContainer}</AccordionDetails>
      </Accordion>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>{asset.uri}</div>
      <Accordion expanded={expandNotes}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="notes-content"
          id="notes-header"
          className={styles.heading}
          onClick={clickNotesAccordionHandler}
        >
          <Typography className={styles.headingTitle}>{notesLabel}</Typography>
        </AccordionSummary>
        <AccordionDetails className={styles.details}>
          <NoteEditor
            notes={asset.notes}
            onDelete={deleteNoteHandler}
            onEditingComplete={updatedNoteHandler}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="notes-attributes"
          id="attributes-header"
          className={styles.heading}
        >
          <Typography className={styles.headingTitle}>Attributes</Typography>
        </AccordionSummary>
        <AccordionDetails className={styles.details}>
          <AssetAttributes
            asset={asset}
            configuration={assetAttributes}
            onUpdateAttribute={updateAssetAttribute}
          />
        </AccordionDetails>
      </Accordion>
      {sourceControlAccordion}
    </div>
  );
};

export default assetDetails;
