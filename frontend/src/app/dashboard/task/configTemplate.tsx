const configTemplate = {
  processors: {
    preprocessors: [],
    postprocessors: []
  },
  global_config: {
    original_data_file: '',
    overwrite: true,
    dataset_type: 'netflow',
    n_chunks: 1,
    dp: false
  },
  default: 'single_event_per_row.json',
  pre_post_processor: {
    class: 'NetsharePrePostProcessor',
    config: {
      timestamp: {
        column: '',
        generation: true,
        encoding: 'interarrival',
        normalization: 'ZERO_ONE'
      },
      word2vec: {
        vec_size: 10,
        model_name: 'word2vec_vecSize',
        annoy_n_trees: 100,
        pretrain_model_path: null
      },
      metadata: [],
      timeseries: []
    }
  },
  model: {
    class: 'DoppelGANgerTorchModel',
    config: {
      batch_size: 100,
      sample_len: [10],
      sample_len_expand: true,
      epochs: 40,
      extra_checkpoint_freq: 1,
      epoch_checkpoint_freq: 5
    }
  }
}

export default configTemplate
